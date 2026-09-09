from rest_framework import serializers

from accounts.models import UserModel
from .profile_serializer import ProfileSerializer
from .settings_serializer import SettingsSerializer


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the main User model.
    Includes nested profile and settings serializers as read-only fields.
    """

    profile = ProfileSerializer(read_only=True)
    settings = SettingsSerializer(read_only=True)

    phoneNumber = serializers.CharField(source="phone_number", read_only=True)

    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = UserModel
        fields = [
            "id",
            "phoneNumber",
            "updatedAt",
            "createdAt",
            "profile",
            "settings",
        ]
        read_only_fields = [
            "id",
            "role",
            "phoneNumber",
            "status",
            "is_staff",
            "createdAt",
            "updatedAt",
            "deleted_at",
            "profile",
            "settings",
        ]
