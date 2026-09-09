from rest_framework import serializers
from django.contrib.auth import get_user_model
from accounts.constants import UserGender, UserTheme, UserLanguage

User = get_user_model()


class RegisterUpdateSerializer(serializers.Serializer):
    # Profile fields
    first_name = serializers.CharField(required=False, allow_blank=True, max_length=50)
    last_name = serializers.CharField(required=False, allow_blank=True, max_length=50)
    gender = serializers.ChoiceField(
        choices=UserGender.choices, required=False, allow_blank=False
    )
    birthday = serializers.DateField(required=False, allow_null=True)
    national_code = serializers.CharField(
        required=False, allow_blank=True, max_length=10
    )

    # Account fields
    password = serializers.CharField(
        write_only=True, required=False, allow_blank=False, min_length=6
    )

    # Settings fields
    theme = serializers.ChoiceField(
        choices=UserTheme.choices, required=False, allow_blank=False
    )
    language = serializers.ChoiceField(
        choices=UserLanguage.choices, required=False, allow_blank=False
    )

    def update(self, instance, validated_data):
        """Update user, profile, and settings info"""
        profile = getattr(instance, "profile", None)
        settings = getattr(instance, "settings", None)

        # Handle password update
        if "password" in validated_data:
            instance.set_password(validated_data.pop("password"))

        # Update basic info
        instance.save()

        # Update profile fields
        if profile:
            for field in [
                "first_name",
                "last_name",
                "gender",
                "birthday",
                "national_code",
            ]:
                if field in validated_data:
                    setattr(profile, field, validated_data[field])
            profile.save()

        # Update settings fields
        if settings:
            for field in ["theme", "language"]:
                if field in validated_data:
                    setattr(settings, field, validated_data[field])
            settings.save()

        return instance
