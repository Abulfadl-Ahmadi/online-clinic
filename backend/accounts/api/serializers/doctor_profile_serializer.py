from rest_framework import serializers
from .specialization_serializer import SpecializationSerializer
from accounts.models import DoctorProfileModel, SpecializationModel


class DoctorProfileSerializer(serializers.ModelSerializer):
    """Serializer for Doctor model."""

    phone_number = serializers.CharField(source="user.phone_number", read_only=True)
    full_name = serializers.CharField(read_only=True)
    specializations = SpecializationSerializer(many=True, read_only=True)
    specialization_ids = serializers.ListField(
        child=serializers.UUIDField(), write_only=True, required=False
    )

    class Meta:
        model = DoctorProfileModel
        fields = [
            "id",
            "phone_number",
            "full_name",
            "medical_license_number",
            "specializations",
            "specialization_ids",
            "bio",
            "years_of_experience",
            "default_consultation_duration",
            "default_price_irr",
            "is_accepting_patients",
            "is_verified",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "is_verified", "created_at", "updated_at"]

    def create(self, validated_data):
        """Create doctor with specializations."""
        specialization_ids = validated_data.pop("specialization_ids", [])
        doctor = DoctorProfileModel.objects.create(**validated_data)

        if specialization_ids:
            specializations = SpecializationModel.objects.filter(
                id__in=specialization_ids
            )
            doctor.specializations.set(specializations)

        return doctor

    def update(self, instance, validated_data):
        """Update doctor with specializations."""
        specialization_ids = validated_data.pop("specialization_ids", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if specialization_ids is not None:
            specializations = SpecializationModel.objects.filter(
                id__in=specialization_ids
            )
            instance.specializations.set(specializations)

        return instance
