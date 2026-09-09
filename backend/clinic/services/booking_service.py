import logging
from decimal import Decimal
from datetime import date, time

from django.db.models import Q
from django.db import transaction
from django.utils import timezone
from django.contrib.auth import get_user_model


from accounts.models import DoctorProfileModel, UserModel
from clinic.constants import AppointmentStatus, AppointmentType, ExceptionType
from clinic.models import (
    AppointmentModel,
    AvailabilityExceptionModel,
    RecurringAvailabilityModel,
)
from .exceptions import (
    SlotNotAvailableError,
    DoubleBookingError,
    InvalidTimeSlotError,
)

User = get_user_model()
logger = logging.getLogger("booking_service")


class BookingService:
    """
    Service for booking appointments with concurrency safety.
    Uses database-level locking to prevent double-booking.
    """

    @staticmethod
    @transaction.atomic
    def create_booking(
        doctor: DoctorProfileModel,
        patient: UserModel,
        appointment_date: date,
        start_time: time,
        end_time: time,
        price_irr: Decimal,
        appointment_type: str = AppointmentType.CONSULTATION,
        patient_notes: str = "",
    ) -> AppointmentModel:
        """
        Create a new appointment booking with concurrency safety.

        Uses SELECT FOR UPDATE to lock conflicting appointments and
        prevent race conditions during booking.

        Args:
            doctor: Doctor instance
            patient: User instance
            appointment_date: Date of appointment
            start_time: Appointment start time
            end_time: Appointment end time
            price_irr: Price in Iranian Rial
            appointment_type: Type of appointment
            patient_notes: Optional notes from patient

        Returns:
            Created Appointment instance

        Raises:
            InvalidTimeSlotError: If time slot is invalid
            SlotNotAvailableError: If slot is not available
            DoubleBookingError: If concurrent booking conflict detected
        """
        logger.info(
            f"Creating booking: doctor={doctor.id}, patient={patient.id}, "
            f"date={appointment_date}, time={start_time}-{end_time}"
        )

        # Validate inputs
        if start_time >= end_time:
            raise InvalidTimeSlotError("End time must be after start time")

        if appointment_date < date.today():
            raise InvalidTimeSlotError("Cannot book appointments in the past")

        # Check doctor is accepting patients
        if not doctor.is_accepting_patients:
            raise SlotNotAvailableError("Doctor is not accepting new patients")

        if not doctor.is_verified:
            raise SlotNotAvailableError("Doctor is not verified")

        # CRITICAL: Lock conflicting appointments to prevent race conditions
        # This query will wait if another transaction is creating a conflicting appointment
        conflicting_appointments = (
            AppointmentModel.objects.select_for_update()
            .filter(
                doctor=doctor,
                appointment_date=appointment_date,
                status__in=[AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING],
            )
            .filter(
                # Check for time overlap using Q objects
                Q(start_time__lt=end_time, end_time__gt=start_time)
            )
        )

        if conflicting_appointments.exists():
            logger.warning(
                f"Double booking detected for doctor={doctor.id}, "
                f"date={appointment_date}, time={start_time}-{end_time}"
            )
            raise DoubleBookingError(
                "This time slot is no longer available. Please choose another slot."
            )

        # Verify slot is actually available based on doctor's schedule
        if not BookingService._is_slot_available(
            doctor, appointment_date, start_time, end_time
        ):
            raise SlotNotAvailableError(
                "This time slot is not available in the doctor's schedule"
            )

        # Create the appointment
        appointment = AppointmentModel.objects.create(
            doctor=doctor,
            patient=patient,
            appointment_date=appointment_date,
            start_time=start_time,
            end_time=end_time,
            appointment_type=appointment_type,
            price_irr=price_irr,
            status=AppointmentStatus.PENDING,
            patient_notes=patient_notes,
        )

        logger.info(f"Appointment created successfully: {appointment.id}")
        return appointment

    @staticmethod
    def _is_slot_available(
        doctor: DoctorProfileModel,
        appointment_date: date,
        start_time: time,
        end_time: time,
    ) -> bool:
        """
        Check if a time slot is available in doctor's schedule.
        Considers recurring availability and exceptions.
        """
        day_of_week = appointment_date.isoweekday()

        # Check for exceptions first
        exception = AvailabilityExceptionModel.objects.filter(
            doctor=doctor, date=appointment_date
        ).first()

        if exception:
            if exception.exception_type == ExceptionType.UNAVAILABLE:
                return False
            else:
                # AVAILABLE exception
                return (
                    exception.start_time is not None
                    and exception.start_time <= start_time
                    and exception.end_time is not None
                    and exception.end_time >= end_time
                )

        # Check recurring availability
        recurring = RecurringAvailabilityModel.objects.filter(
            doctor=doctor,
            day_of_week=day_of_week,
            is_active=True,
            valid_from__lte=appointment_date,
        ).filter(Q(valid_until__isnull=True) | Q(valid_until__gte=appointment_date))

        for avail in recurring:
            if avail.start_time <= start_time and avail.end_time >= end_time:
                return True

        return False

    @staticmethod
    @transaction.atomic
    def confirm_appointment(appointment_id: str) -> AppointmentModel:
        """
        Confirm an appointment (typically after successful payment).

        Args:
            appointment_id: UUID of appointment

        Returns:
            Updated Appointment instance
        """
        appointment = AppointmentModel.objects.select_for_update().get(
            id=appointment_id
        )

        if appointment.status != AppointmentStatus.PENDING:
            logger.warning(
                f"Attempted to confirm appointment {appointment_id} "
                f"with status {appointment.status}"
            )
            raise ValueError(
                f"Cannot confirm appointment with status {appointment.status}"
            )

        appointment.status = AppointmentStatus.CONFIRMED
        appointment.confirmed_at = timezone.now()
        appointment.save(update_fields=["status", "confirmed_at", "updated_at"])

        logger.info(f"Appointment {appointment_id} confirmed")
        return appointment

    @staticmethod
    @transaction.atomic
    def cancel_appointment(appointment_id: str, reason: str = "") -> AppointmentModel:
        """
        Cancel an appointment.

        Args:
            appointment_id: UUID of appointment
            reason: Cancellation reason

        Returns:
            Updated Appointment instance
        """
        appointment = AppointmentModel.objects.select_for_update().get(
            id=appointment_id
        )

        if appointment.status in [
            AppointmentStatus.CANCELLED,
            AppointmentStatus.COMPLETED,
        ]:
            raise ValueError(
                f"Cannot cancel appointment with status {appointment.status}"
            )

        appointment.status = AppointmentStatus.CANCELLED
        appointment.cancellation_reason = reason
        appointment.cancelled_at = timezone.now()
        appointment.save(
            update_fields=[
                "status",
                "cancellation_reason",
                "cancelled_at",
                "updated_at",
            ]
        )

        logger.info(f"Appointment {appointment_id} cancelled")
        return appointment
