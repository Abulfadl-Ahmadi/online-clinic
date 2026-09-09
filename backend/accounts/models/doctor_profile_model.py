import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

User = get_user_model()


class SpecializationModel(models.Model):
    """Medical specialization categories."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=100, unique=True)

    description = models.TextField(blank=True)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Specialization"
        verbose_name_plural = "Specializations"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class DoctorProfileModel(models.Model):
    """
    Doctor profile extending the User model.
    Only users with role=DOCTOR can have a doctor profile.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="doctor_profile"
    )

    # Professional information
    medical_license_number = models.CharField(
        max_length=50, unique=True, help_text="Medical council registration number"
    )
    specializations = models.ManyToManyField(
        SpecializationModel, related_name="doctors", blank=True
    )
    bio = models.TextField(
        blank=True, help_text="Professional biography and qualifications"
    )
    years_of_experience = models.PositiveIntegerField(
        default=0, validators=[MinValueValidator(0)]
    )

    # Consultation settings
    default_consultation_duration = models.PositiveIntegerField(
        default=30, help_text="Default consultation duration in minutes"
    )
    default_price_irr = models.DecimalField(
        max_digits=21,
        decimal_places=0,
        default=Decimal(100_000),
        validators=[MinValueValidator(100_000)],
    )

    # Status
    is_accepting_patients = models.BooleanField(
        default=True,
        help_text="Whether the doctor is currently accepting new appointments",
    )
    is_verified = models.BooleanField(
        default=False, help_text="Admin verification status"
    )

    # Timestamps
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Doctor"
        verbose_name_plural = "Doctors"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_accepting_patients", "is_verified"]),
        ]

    def __str__(self) -> str:
        profile = getattr(self.user, "profile", None)
        if profile and profile.first_name and profile.last_name:
            return f"Dr. {profile.first_name} {profile.last_name}"
        return f"Dr. {self.user.phone_number}"  # type: ignore

    @property
    def full_name(self) -> str:
        """Get doctor's full name from user profile."""
        profile = getattr(self.user, "profile", None)
        if profile and profile.first_name and profile.last_name:
            return f"{profile.first_name} {profile.last_name}"
        return self.user.phone_number  # type: ignore
