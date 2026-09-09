import uuid
from datetime import datetime

from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator


from accounts.models import DoctorProfileModel
from clinic.constants import AppointmentStatus, AppointmentType


User = get_user_model()


class AppointmentModel(models.Model):
    """
    Appointment booking with concurrency-safe locking.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relationships
    doctor = models.ForeignKey(
        DoctorProfileModel, on_delete=models.PROTECT, related_name="appointments"
    )
    patient = models.ForeignKey(
        User, on_delete=models.PROTECT, related_name="appointments"
    )

    # Appointment details
    appointment_date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    appointment_type = models.CharField(
        max_length=20,
        choices=AppointmentType.choices,
        default=AppointmentType.CONSULTATION,
    )

    # Pricing
    price_irr = models.DecimalField(
        max_digits=21,
        decimal_places=0,
        validators=[MinValueValidator(100_000)],
        help_text="Final agreed price in Iranian Rial",
    )

    # Status
    status = models.CharField(
        max_length=20,
        choices=AppointmentStatus.choices,
        default=AppointmentStatus.PENDING,
        db_index=True,
    )

    # Notes
    patient_notes = models.TextField(
        blank=True, help_text="Notes from patient about symptoms/concerns"
    )
    doctor_notes = models.TextField(blank=True, help_text="Internal notes from doctor")
    cancellation_reason = models.TextField(blank=True)

    # Timestamps
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Appointment"
        verbose_name_plural = "Appointments"
        ordering = ["-appointment_date", "-start_time"]
        indexes = [
            models.Index(fields=["doctor", "appointment_date", "status"]),
            models.Index(fields=["patient", "appointment_date", "status"]),
            models.Index(fields=["appointment_date", "start_time", "end_time"]),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(start_time__lt=models.F("end_time")),
                name="appointment_start_before_end",
            )
        ]

    def __str__(self) -> str:
        return (
            f"{self.patient.phone_number} -> {self.doctor} "  # type: ignore
            f"on {self.appointment_date} at {self.start_time}"
        )

    @property
    def is_upcoming(self) -> bool:
        """Check if appointment is in the future."""
        now = timezone.now()
        appt_datetime = timezone.make_aware(
            datetime.combine(self.appointment_date, self.start_time)
        )
        return appt_datetime > now and self.status == AppointmentStatus.CONFIRMED

    def clean(self):
        """Validate appointment data."""
        super().clean()

        if self.start_time >= self.end_time:
            raise ValidationError("End time must be after start time")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)
