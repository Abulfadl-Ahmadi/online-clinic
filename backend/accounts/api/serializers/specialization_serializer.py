from rest_framework import serializers
from accounts.models import SpecializationModel


class SpecializationSerializer(serializers.ModelSerializer):
    """Serializer for Specialization model."""

    class Meta:
        model = SpecializationModel
        fields = ["id", "name", "description", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]
