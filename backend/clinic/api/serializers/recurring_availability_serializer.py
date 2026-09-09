from django.utils import timezone
from rest_framework import serializers
from clinic.models import RecurringAvailabilityModel


class RecurringAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for recurring availability."""

    day_of_week_display = serializers.CharField(
        source="get_day_of_week_display", read_only=True
    )
    appointment_type_display = serializers.CharField(
        source="get_appointment_type_display", read_only=True
    )

    valid_from = serializers.DateField(required=False, allow_null=True)
    valid_until = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = RecurringAvailabilityModel
        fields = [
            "id",
            "doctor",
            "day_of_week",
            "day_of_week_display",
            "start_time",
            "end_time",
            "price_irr",
            "duration_minutes",
            "appointment_type",
            "appointment_type_display",
            "is_active",
            "valid_from",
            "valid_until",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "doctor", "created_at", "updated_at"]

    def validate(self, data):
        # Convert empty strings to None
        if data.get("valid_from") in ("", None):
            data["valid_from"] = timezone.now().date()
        if data.get("valid_until") in ("", None):
            data["valid_until"] = None

        # default doctor
        doctor = self.context["request"].user.doctor_profile

        # Prevent duplicate
        qs = RecurringAvailabilityModel.objects.filter(
            doctor=doctor,
            day_of_week=data.get("day_of_week"),
            start_time=data.get("start_time"),
            end_time=data.get("end_time"),
        )
        if qs.exists():
            raise serializers.ValidationError("this time slot is already available")

        # Time check
        if data.get("start_time") and data.get("end_time"):
            if data["start_time"] >= data["end_time"]:
                raise serializers.ValidationError("end_time must be after start_time")

        # Date check
        valid_from = data.get("valid_from")
        valid_until = data.get("valid_until")
        if valid_from and valid_until and valid_from > valid_until:
            raise serializers.ValidationError("valid_from must be before valid_until")

        return data
