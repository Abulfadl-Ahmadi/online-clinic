from django.db import models


class AppointmentStatus(models.TextChoices):
    """Appointment booking status."""

    PENDING = "pending", "Pending Payment"
    CONFIRMED = "confirmed", "Confirmed"
    CANCELLED = "cancelled", "Cancelled"
    COMPLETED = "completed", "Completed"
    NO_SHOW = "no_show", "No Show"


class AppointmentType(models.TextChoices):
    """Types of appointments."""

    CONSULTATION = "consultation", "Consultation"
    FOLLOW_UP = "follow_up", "Follow-up"
    EMERGENCY = "emergency", "Emergency"


class ExceptionType(models.TextChoices):
    UNAVAILABLE = "unavailable", "Unavailable (blocks recurring)"
    AVAILABLE = "available", "Available (adds new slots)"


class DayOfWeek(models.IntegerChoices):
    """ISO weekday constants."""

    MONDAY = 1, "Monday"
    TUESDAY = 2, "Tuesday"
    WEDNESDAY = 3, "Wednesday"
    THURSDAY = 4, "Thursday"
    FRIDAY = 5, "Friday"
    SATURDAY = 6, "Saturday"
    SUNDAY = 7, "Sunday"
