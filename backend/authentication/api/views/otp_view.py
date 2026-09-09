import logging
from django.conf import settings
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle

from authentication.tasks import send_sms_task
from accounts.utils import normalize_phone_number
from accounts.constants import UserRole, UserStatus
from authentication.models.otp_model import OTPModel
from authentication.constants import SMS_IN_DEV, OTPType
from authentication.api.serializers import SendOTPSerializer, VerifyOTPSerializer


UserModel = get_user_model()
logger = logging.getLogger("otp_api")


# ---------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------


def log_debug_sms(phone: str, code: str):
    """Print OTP to console in development."""
    print("\n========== OTP DEBUG ==========")
    print(f"Phone: {phone}")
    print(f"Code:  {code}")
    print("================================\n")


def send_otp_sms(phone: str, code: str, template_id: int = 334868):
    """
    Sends the OTP to user phone number.
    Uses async Celery task in production, and console in dev mode.
    """
    if not SMS_IN_DEV and settings.DEBUG:
        log_debug_sms(phone, code)
    else:
        send_sms_task.delay(phone, code, template_id=template_id)  # type: ignore


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

        if otp_type == OTPType.REGISTER:
            user = UserModel.objects.filter(phone_number=phone).first()
            if user:
                return Response(
                    {"message": "User already exists."},
                    status=status.HTTP_409_CONFLICT,
                )

        otp = OTPModel.generate_otp(phone_number=phone, type=otp_type)  # type: ignore

        send_otp_sms(phone, otp.plain_code)  # type: ignore

        logger.info(
            f"OTP generated for {phone} ({otp_type})",
            extra={"phone_number": phone, "otp_type": otp_type},
        )

        return Response(
            {"message": "OTP sent successfully."},
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
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        otp_instance: OTPModel = serializer.validated_data["otp_instance"]  # type: ignore
        phone = normalize_phone_number(serializer.validated_data["phone_number"])  # type: ignore
        otp_type = request.query_params.get("type", OTPType.LOGIN)

        otp_instance.mark_used()

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
