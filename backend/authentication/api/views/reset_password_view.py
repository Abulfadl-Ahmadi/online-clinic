from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from accounts.constants import UserStatus
from accounts.utils import normalize_phone_number
from authentication.api.serializers import VerifyOTPSerializer
from authentication.constants import OTPType


class ResetPasswordSerializer(VerifyOTPSerializer):
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        try:
            validate_password(value)
        except ValidationError as exc:
            raise serializers.ValidationError(exc.messages)
        return value


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    http_method_names = ["post"]
    throttle_scope = "otp"
    throttle_classes = [ScopedRateThrottle]

    def post(self, request):
        serializer = ResetPasswordSerializer(
            data=request.data, context={"otp_type": OTPType.RESET_PASSWORD}
        )
        serializer.is_valid(raise_exception=True)
        phone = normalize_phone_number(serializer.validated_data["phone_number"])
        user = get_user_model().objects.filter(phone_number=phone, status=UserStatus.ACTIVE).first()
        if user is None:
            return Response({"message": "Invalid or expired code."}, status=status.HTTP_400_BAD_REQUEST)
        otp = serializer.validated_data["otp_instance"]
        otp.mark_used()
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        return Response({"message": "Password reset successfully."})
