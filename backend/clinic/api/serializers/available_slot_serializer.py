from rest_framework import serializers


class AvailableSlotSerializer(serializers.Serializer):
    """Serializer for available time slots (read-only)."""

    # date = serializers.DateField()
    # start_time = serializers.TimeField()
    # end_time = serializers.TimeField()
    # price_irr = serializers.DecimalField(max_digits=21, decimal_places=0)
    # duration_minutes = serializers.IntegerField()
    # appointment_type = serializers.CharField()
    # is_available = serializers.BooleanField()

    date = serializers.DateField(read_only=True)
    startTime = serializers.TimeField(read_only=True, source="start_time")
    endTime = serializers.TimeField(read_only=True, source="end_time")
    priceIrr = serializers.DecimalField(
        max_digits=21, decimal_places=0, read_only=True, source="price_irr"
    )
    durationMinutes = serializers.IntegerField(
        read_only=True, source="duration_minutes"
    )
    appointmentType = serializers.CharField(read_only=True, source="appointment_type")
    isAvailable = serializers.BooleanField(read_only=True, source="is_available")
