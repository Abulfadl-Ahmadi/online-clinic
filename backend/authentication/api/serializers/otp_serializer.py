from rest_framework import serializers

from authentication.models import OTPModel
from authentication.utils import phone_regex
from authentication.constants import OTP_LENGTH
from accounts.utils import normalize_phone_number


class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        validators=[phone_regex],
        min_length=11,
        max_length=15,
        error_messages={
            "required": "phone number is required",
            "blank": "phone number cannot be blank",
        },
    )


class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(
        validators=[phone_regex],
        min_length=11,
        max_length=15,
        error_messages={
            "required": "phone number is required",
            "blank": "phone number cannot be blank",
        },
    )

    code = serializers.CharField(min_length=OTP_LENGTH, max_length=OTP_LENGTH)

    def validate(self, attrs):

        code = attrs.get("code")
        phone_number = normalize_phone_number(attrs.get("phone_number"))

        # Validate the code
        otp = (
            OTPModel.objects.filter(phone_number=phone_number, is_used=False)
            .order_by("-created_at")
            .first()
        )

        if otp is None or otp.expired or not otp.check_code(code):
            raise serializers.ValidationError("Invalid or expired code.")

        attrs["otp_instance"] = otp
        return attrs
