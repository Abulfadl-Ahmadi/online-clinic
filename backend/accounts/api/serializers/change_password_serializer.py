import logging
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

logger = logging.getLogger("accounts_api")


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change endpoint.
    Requires current password, new password, and confirmation of new password.
    Supports both snake_case and camelCase field naming.
    """

    old_password = serializers.CharField(
        required=False,
        write_only=True,
        style={"input_type": "password"},
    )
    new_password = serializers.CharField(
        required=False,
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )
    confirm_new_password = serializers.CharField(
        required=False,
        write_only=True,
        min_length=8,
        style={"input_type": "password"},
    )

    def validate(self, attrs):
        request = self.context.get("request")
        if not request or not request.user:
            raise serializers.ValidationError(
                {"detail": "کاربر احراز هویت نشده است.", "message": "کاربر احراز هویت نشده است."}
            )

        user = request.user

        # Support both snake_case and camelCase field names
        initial_data = self.initial_data
        old_password = (
            attrs.get("old_password")
            or initial_data.get("oldPassword")
            or initial_data.get("current_password")
            or initial_data.get("currentPassword")
        )
        new_password = attrs.get("new_password") or initial_data.get("newPassword")
        confirm_new_password = (
            attrs.get("confirm_new_password")
            or initial_data.get("confirmNewPassword")
            or initial_data.get("confirmPassword")
            or initial_data.get("confirm_password")
        )

        if not old_password:
            raise serializers.ValidationError({
                "old_password": ["رمز عبور فعلی الزامی است."],
                "message": "رمز عبور فعلی الزامی است.",
            })

        if not new_password:
            raise serializers.ValidationError({
                "new_password": ["رمز عبور جدید الزامی است."],
                "message": "رمز عبور جدید الزامی است.",
            })

        if len(new_password) < 8:
            raise serializers.ValidationError({
                "new_password": ["رمز عبور جدید باید حداقل ۸ کاراکتر باشد."],
                "message": "رمز عبور جدید باید حداقل ۸ کاراکتر باشد.",
            })

        if not confirm_new_password:
            raise serializers.ValidationError({
                "confirm_new_password": ["تکرار رمز عبور جدید الزامی است."],
                "message": "تکرار رمز عبور جدید الزامی است.",
            })

        # Check if old password matches current user password
        if not user.check_password(old_password):
            raise serializers.ValidationError({
                "old_password": ["رمز عبور فعلی نادرست است."],
                "message": "رمز عبور فعلی نادرست است.",
            })

        # Check if new password matches confirmation
        if new_password != confirm_new_password:
            raise serializers.ValidationError({
                "confirm_new_password": ["رمز عبور جدید و تکرار آن یکسان نیستند."],
                "message": "رمز عبور جدید و تکرار آن یکسان نیستند.",
            })

        # Check if new password is same as old password
        if old_password == new_password:
            raise serializers.ValidationError({
                "new_password": ["رمز عبور جدید نباید مشابه رمز عبور فعلی باشد."],
                "message": "رمز عبور جدید نباید مشابه رمز عبور فعلی باشد.",
            })

        # Validate with Django's built-in password validators
        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({
                "new_password": list(exc.messages),
                "message": " ".join(exc.messages),
            })

        attrs["old_password"] = old_password
        attrs["new_password"] = new_password
        attrs["confirm_new_password"] = confirm_new_password
        return attrs

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
