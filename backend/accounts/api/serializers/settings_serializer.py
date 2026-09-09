from rest_framework import serializers
from accounts.models import SettingsModel


class SettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for user-specific settings.
    """

    # updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)
    # createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = SettingsModel
        fields = [
            # "id",
            "theme",
            "language",
            # "updatedAt",
            # "createdAt",
        ]
        read_only_fields = [
            "id",
            "user",
            "updatedAt",
            "createdAt",
        ]
        extra_kwargs = {
            "theme": {"required": False},
            "language": {"required": False},
        }
