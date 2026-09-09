import uuid

from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator


from accounts.constants import UserRole
from accounts.models import DoctorProfileModel
from clinic.constants import AppointmentType, DayOfWeek, ExceptionType


class RecurringAvailabilityModel(models.Model):
    """
    Recurring weekly availability for doctors.
    Defines regular working hours (e.g., every Monday 9-12).
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        DoctorProfileModel,
        on_delete=models.CASCADE,
        related_name="recurring_availabilities",
    )

    # Day and time
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    start_time = models.TimeField()
    end_time = models.TimeField()

    # Pricing and metadata
    price_irr = models.DecimalField(
        max_digits=21,
        decimal_places=0,
        validators=[MinValueValidator(100_000)],
        help_text="Price in Iranian Rial",
    )
    duration_minutes = models.PositiveIntegerField(
        default=30, help_text="Appointment slot duration in minutes"
    )
    appointment_type = models.CharField(
        max_length=20,
        choices=AppointmentType.choices,
        default=AppointmentType.CONSULTATION,
    )

    # Status
    is_active = models.BooleanField(
        default=True, help_text="Whether this availability is currently active"
    )

    # Validity period
    valid_from = models.DateField(
        default=timezone.now, help_text="When this availability pattern becomes active"
    )
    valid_until = models.DateField(
        null=True,
        blank=True,
        help_text="When this availability pattern expires (null = no expiry)",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Recurring Availability"
        verbose_name_plural = "Recurring Availabilities"
        ordering = ["day_of_week", "start_time"]
        indexes = [
            models.Index(fields=["doctor", "is_active", "day_of_week"]),
        ]
        unique_together = [["doctor", "day_of_week", "start_time", "end_time"]]

    def __str__(self) -> str:
        return (
            f"{self.doctor} "
            f"{self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')}"
        )

    def clean(self):
        """Validate time ranges."""
        super().clean()

        if self.doctor.user.role != UserRole.DOCTOR:  # type: ignore
            raise ValidationError("Only doctors can have recurring availabilities")

        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

        if self.valid_until and self.valid_from > self.valid_until:
            raise ValidationError("valid_from must be before valid_until")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


class AvailabilityExceptionModel(models.Model):
    """
    Single-date availability exceptions (overrides or additions).
    Used for vacations, holidays, or one-off availability.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    doctor = models.ForeignKey(
        DoctorProfileModel,
        on_delete=models.CASCADE,
        related_name="availability_exceptions",
    )

    # Date and type
    date = models.DateField(db_index=True)
    exception_type = models.CharField(max_length=20, choices=ExceptionType.choices)

    # Time range (only for AVAILABLE type)
    start_time = models.TimeField(null=True, blank=True)
    end_time = models.TimeField(null=True, blank=True)

    # Pricing and metadata (only for AVAILABLE type)
    price_irr = models.DecimalField(
        max_digits=21,
        decimal_places=0,
        null=True,
        blank=True,
        validators=[MinValueValidator(100_000)],
        help_text="Price in Iranian Rial",
    )
    duration_minutes = models.PositiveIntegerField(
        null=True, blank=True, help_text="Appointment slot duration in minutes"
    )
    appointment_type = models.CharField(
        max_length=20, choices=AppointmentType.choices, null=True, blank=True
    )

    # Description
    reason = models.CharField(
        max_length=200,
        blank=True,
        help_text="Reason for exception (e.g., vacation, conference)",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Availability Exception"
        verbose_name_plural = "Availability Exceptions"
        ordering = ["date", "start_time"]
        indexes = [
            models.Index(fields=["doctor", "date"]),
        ]

    def __str__(self) -> str:
        return f"{self.doctor} - {self.date} ({self.exception_type})"

    def clean(self):
        """Validate exception data based on type."""
        super().clean()

        if self.exception_type == ExceptionType.AVAILABLE:
            if not self.start_time or not self.end_time:
                raise ValidationError(
                    "start_time and end_time are required for AVAILABLE exceptions"
                )
            if self.start_time >= self.end_time:
                raise ValidationError("End time must be after start time")
            if not self.price_irr:
                raise ValidationError("price_irr is required for AVAILABLE exceptions")
            if not self.duration_minutes:
                raise ValidationError(
                    "duration_minutes is required for AVAILABLE exceptions"
                )

        # UNAVAILABLE doesn't need time/price fields
        if self.exception_type == ExceptionType.UNAVAILABLE:
            self.start_time = None
            self.end_time = None
            self.price_irr = None
            self.duration_minutes = None
            self.appointment_type = None

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
