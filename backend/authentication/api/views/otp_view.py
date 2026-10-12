import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle

from authentication.sms_provider import SmsResult, send_verification_sms
from accounts.utils import normalize_phone_number
from accounts.constants import UserRole, UserStatus
from authentication.models.otp_model import OTPModel
from authentication.constants import (
    SMS_TEMPLATE_ID, RESET_PASSWORD_SMS_TEMPLATE_ID,
    SMS_API_KEY, VERIFY_SMS_API_URL, OTPType,
)
from authentication.api.serializers import SendOTPSerializer, VerifyOTPSerializer


UserModel = get_user_model()
logger = logging.getLogger("otp_api")


# ---------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------


def send_otp_sms(phone: str, code: str, template_id: int) -> SmsResult:
    """Return provider acceptance; handset delivery is a separate later event."""
    return send_verification_sms(phone, code, template_id=template_id)


# ---------------------------------------------------------------------
# Send OTP
# ---------------------------------------------------------------------


class SendOTPView(APIView):
    """
    Send a one-time password (OTP) to a user's phone number.
    Supports `type` query parameter: login | register | reset_password.
    """

    permission_classes = [AllowAny]
    http_method_names = ["post"]
    throttle_scope = "otp"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request: Request) -> Response:
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = normalize_phone_number(serializer.validated_data["phone_number"])  # type: ignore
        otp_type = request.query_params.get("type", OTPType.LOGIN)
        if otp_type not in OTPType.values:
            return Response({"message": "Invalid OTP type."}, status=status.HTTP_400_BAD_REQUEST)

        user = UserModel.objects.filter(phone_number=phone).first()
        if otp_type == OTPType.REGISTER and user:
            return Response({"message": "User already exists."}, status=status.HTTP_409_CONFLICT)
        if otp_type in (OTPType.LOGIN, OTPType.RESET_PASSWORD) and (
            not user or user.status != UserStatus.ACTIVE
        ):
            return Response({"message": "Account unavailable."}, status=status.HTTP_400_BAD_REQUEST)

        template_id = (
            RESET_PASSWORD_SMS_TEMPLATE_ID if otp_type == OTPType.RESET_PASSWORD
            else SMS_TEMPLATE_ID
        )
        if not (SMS_API_KEY and VERIFY_SMS_API_URL and template_id):
            return Response({"message": "SMS service unavailable."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        otp = OTPModel.generate_otp(phone_number=phone, type=otp_type)  # type: ignore
        send_result = send_otp_sms(phone, otp.plain_code, template_id)  # type: ignore
        if not send_result.accepted:
            otp.delete()
            return Response(
                {"message": "SMS service did not accept the request.", "sms_status": "rejected"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        logger.info("OTP request accepted type=%s message_id=%s", otp_type, send_result.message_id)
        return Response(
            {"message": "SMS request accepted; delivery is not yet confirmed.",
             "sms_status": "accepted"},
            status=status.HTTP_200_OK,
        )


# ---------------------------------------------------------------------
# Verify OTP
# ---------------------------------------------------------------------


class VerifyOTPView(APIView):
    """
    Verify the OTP and issue JWT tokens (access + refresh).
    Query param `type` determines behavior:
    - login → must exist
    - register → creates new user if not exists
    """

    permission_classes = [AllowAny]
    http_method_names = ["post"]
    throttle_scope = "anon"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request: Request) -> Response:
        otp_type = request.query_params.get("type", OTPType.LOGIN)
        if otp_type not in (OTPType.LOGIN, OTPType.REGISTER):
            return Response({"message": "Invalid OTP type."}, status=status.HTTP_400_BAD_REQUEST)
        serializer = VerifyOTPSerializer(data=request.data, context={"otp_type": otp_type})
        serializer.is_valid(raise_exception=True)

        otp_instance: OTPModel = serializer.validated_data["otp_instance"]  # type: ignore
        phone = normalize_phone_number(serializer.validated_data["phone_number"])  # type: ignore

        # --------------------------------------------------------------
        # Handle user by OTP type
        # --------------------------------------------------------------
        user = None

        if otp_type == OTPType.LOGIN:
            user = UserModel.objects.filter(phone_number=phone).first()
            if not user:
                return Response(
                    {"message": "User not found or invalid code."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        elif otp_type == OTPType.REGISTER:
            user, created = UserModel.objects.get_or_create(
                phone_number=phone,
                defaults={"status": UserStatus.ACTIVE, "role": UserRole.USER},
            )
            if not created and user.status != UserStatus.ACTIVE:  # type: ignore
                return Response(
                    {"message": "User already exists or inactive."},
                    status=status.HTTP_409_CONFLICT,
                )

        else:
            return Response(
                {"message": f"Unsupported OTP type: {otp_type}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if user.status != UserStatus.ACTIVE:  # type: ignore
            return Response(
                {"message": "User account is not active."},
                status=status.HTTP_403_FORBIDDEN,
            )

        otp_instance.mark_used()

        # --------------------------------------------------------------
        # Generate JWT tokens
        # --------------------------------------------------------------

        token = user.generate_jwt_token()  # type: ignore
        refresh_token = str(token)
        access_token = str(token.access_token)

        logger.info(
            f"User {user.phone_number} authenticated via OTP ({otp_type})",  # type: ignore
            extra={"phone_number": user.phone_number, "otp_type": otp_type},  # type: ignore
        )

        return Response(
            data={
                "access": access_token,
                "refresh": refresh_token,
            },
            status=status.HTTP_200_OK,
        )
