from rest_framework import serializers
from django.contrib.auth import authenticate

from authentication.utils import phone_regex
from accounts.utils import normalize_phone_number


class LoginSerializer(serializers.Serializer):
    """
    Serializer for authenticating a user.
    """

    phone_number = serializers.CharField(
        validators=[phone_regex],
        min_length=11,
        max_length=15,
        error_messages={
            "required": "phone_number is required",
            "blank": "phone_number cannot be blank",
        },
    )
    password = serializers.CharField(
        required=True,
        write_only=True,
        style={"input_type": "password"},
        error_messages={
            "required": "Password is required",
            "blank": "Password cannot be blank",
        },
    )

    def validate(self, data):
        phone_number = data.get("phone_number")
        password = data.get("password")

        # Normalize to +989xxxxxxxxx format
        phone_number = normalize_phone_number(phone_number)

        # Authenticate the user
        user = authenticate(username=phone_number, password=password)
        if user is None or not user.is_active:
            raise serializers.ValidationError(
                {"detail": "Invalid phone number or password."}
            )
        data["user"] = user
        return data
