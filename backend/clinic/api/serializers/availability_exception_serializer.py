from rest_framework import serializers
from clinic.models import AvailabilityExceptionModel


class AvailabilityExceptionSerializer(serializers.ModelSerializer):
    """Serializer for availability exceptions."""

    exception_type_display = serializers.CharField(
        source="get_exception_type_display", read_only=True
    )
    appointment_type_display = serializers.CharField(
        source="get_appointment_type_display", read_only=True
    )

    class Meta:
        model = AvailabilityExceptionModel
        fields = [
            "id",
            "doctor",
            "date",
            "exception_type",
            "exception_type_display",
            "start_time",
            "end_time",
            "price_irr",
            "duration_minutes",
            "appointment_type",
            "appointment_type_display",
            "reason",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
