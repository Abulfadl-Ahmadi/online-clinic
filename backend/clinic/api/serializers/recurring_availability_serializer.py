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
        if data.get("valid_from") in ("", None) and not self.instance:
            data["valid_from"] = timezone.now().date()
        if data.get("valid_until") in ("", None):
            data["valid_until"] = None

        request = self.context.get("request")
        doctor = None
        if request and hasattr(request.user, "doctor_profile"):
            doctor = request.user.doctor_profile
        elif self.instance:
            doctor = self.instance.doctor

        day_of_week = (
            data.get("day_of_week")
            if "day_of_week" in data
            else (self.instance.day_of_week if self.instance else None)
        )
        start_time = (
            data.get("start_time")
            if "start_time" in data
            else (self.instance.start_time if self.instance else None)
        )
        end_time = (
            data.get("end_time")
            if "end_time" in data
            else (self.instance.end_time if self.instance else None)
        )

        # Prevent duplicate
        if doctor and day_of_week is not None and start_time and end_time:
            qs = RecurringAvailabilityModel.objects.filter(
                doctor=doctor,
                day_of_week=day_of_week,
                start_time=start_time,
                end_time=end_time,
            )
            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)
            if qs.exists():
                raise serializers.ValidationError("this time slot is already available")

        # Time check
        if start_time and end_time:
            if start_time >= end_time:
                raise serializers.ValidationError("end_time must be after start_time")

        # Date check
        valid_from = (
            data.get("valid_from")
            if "valid_from" in data
            else (self.instance.valid_from if self.instance else None)
        )
        valid_until = (
            data.get("valid_until")
            if "valid_until" in data
            else (self.instance.valid_until if self.instance else None)
        )
        if valid_from and valid_until and valid_from > valid_until:
            raise serializers.ValidationError("valid_from must be before valid_until")

        return data
