from rest_framework import serializers

from clinic.models import AppointmentModel
from clinic.constants import AppointmentType
from accounts.models import DoctorProfileModel


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for appointments."""

    doctor_name = serializers.SerializerMethodField()
    patient_phone = serializers.CharField(source="patient.phone_number", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    appointment_type_display = serializers.CharField(
        source="get_appointment_type_display", read_only=True
    )
    is_upcoming = serializers.BooleanField(read_only=True)
    payment_status = serializers.SerializerMethodField()
    payment_id = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentModel
        fields = [
            "id",
            "doctor",
            "doctor_name",
            "patient",
            "patient_phone",
            "appointment_date",
            "start_time",
            "end_time",
            "appointment_type",
            "appointment_type_display",
            "price_irr",
            "status",
            "status_display",
            "patient_notes",
            "doctor_notes",
            "cancellation_reason",
            "is_upcoming",
            "payment_status",
            "payment_id",
            "created_at",
            "updated_at",
            "confirmed_at",
            "cancelled_at",
        ]
        read_only_fields = [
            "id",
            "status",
            "doctor_notes",
            "cancellation_reason",
            "created_at",
            "updated_at",
            "confirmed_at",
            "cancelled_at",
        ]

    def get_doctor_name(self, obj):
        """Get doctor's full name."""
        return obj.doctor.full_name

    def get_payment_status(self, obj):
        """Get payment status."""
        try:
            return obj.payment.status
        except:
            return None

    def get_payment_id(self, obj):
        """Get payment ID."""
        try:
            return str(obj.payment.id)
        except:
            return None


class AppointmentCreateSerializer(serializers.Serializer):
    """Serializer for creating appointments."""

    doctor_id = serializers.UUIDField()
    appointment_date = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()
    appointment_type = serializers.ChoiceField(
        choices=AppointmentType.choices, default=AppointmentType.CONSULTATION
    )
    patient_notes = serializers.CharField(
        required=False, allow_blank=True, max_length=1000
    )

    def validate(self, data):
        """Validate appointment creation data."""
        if data["start_time"] >= data["end_time"]:
            raise serializers.ValidationError("end_time must be after start_time")

        # Verify doctor exists
        try:
            DoctorProfileModel.objects.get(id=data["doctor_id"])
        except DoctorProfileModel.DoesNotExist:
            raise serializers.ValidationError("Doctor not found")

        return data


class AppointmentCancelSerializer(serializers.Serializer):
    """Serializer for cancelling appointments."""

    reason = serializers.CharField(required=False, allow_blank=True, max_length=500)
