import logging
from typing import List, Dict, Tuple
from datetime import datetime, date, time, timedelta

from django.db.models import Q
from django.contrib.auth import get_user_model


from accounts.models import DoctorProfileModel
from clinic.constants import AppointmentStatus, ExceptionType
from clinic.models import (
    AppointmentModel,
    AvailabilityExceptionModel,
    RecurringAvailabilityModel,
)


User = get_user_model()
logger = logging.getLogger("availability_service")


class AvailabilityService:
    """Service for managing doctor availability."""

    @staticmethod
    def get_available_slots(
        doctor: DoctorProfileModel, start_date: date, end_date: date
    ) -> List[Dict]:
        """
        Get all available time slots for a doctor within a date range.
        Considers recurring availability and exceptions.

        Returns:
            List of dicts with slot information:
            [{
                'date': date,
                'start_time': time,
                'end_time': time,
                'price_irr': Decimal,
                'duration_minutes': int,
                'appointment_type': str,
                'is_available': bool
            }]
        """
        slots = []

        # Get all exceptions for the date range
        exceptions = AvailabilityExceptionModel.objects.filter(
            doctor=doctor, date__gte=start_date, date__lte=end_date
        ).select_related("doctor")

        exception_map = {exc.date: exc for exc in exceptions}

        # Get recurring availabilities
        recurring = RecurringAvailabilityModel.objects.filter(
            doctor=doctor, is_active=True, valid_from__lte=end_date
        ).filter(Q(valid_until__isnull=True) | Q(valid_until__gte=start_date))

        # Get existing appointments to check availability
        existing_appointments = AppointmentModel.objects.filter(
            doctor=doctor,
            appointment_date__gte=start_date,
            appointment_date__lte=end_date,
            status__in=[AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING],
        ).values("appointment_date", "start_time", "end_time")

        # Build appointment lookup
        booked_slots = set()
        for appt in existing_appointments:
            booked_slots.add(
                (appt["appointment_date"], appt["start_time"], appt["end_time"])
            )

        # Iterate through date range
        current_date = start_date
        while current_date <= end_date:
            day_of_week = current_date.isoweekday()

            # Check for exceptions first
            exception = exception_map.get(current_date)

            if exception:
                if exception.exception_type == ExceptionType.UNAVAILABLE:
                    # Skip this day entirely
                    current_date += timedelta(days=1)
                    continue
                else:
                    # AVAILABLE exception - add these slots
                    # Ensure start_time and end_time are not None for _generate_time_slots
                    if exception.start_time and exception.end_time:
                        time_slots = AvailabilityService._generate_time_slots(
                            exception.start_time,
                            exception.end_time,
                            exception.duration_minutes
                            or 0,  # Provide a default or handle None
                        )

                        for start, end in time_slots:
                            is_available = (
                                current_date,
                                start,
                                end,
                            ) not in booked_slots
                            slots.append(
                                {
                                    "date": current_date,
                                    "start_time": start,
                                    "end_time": end,
                                    "price_irr": exception.price_irr,
                                    "duration_minutes": exception.duration_minutes,
                                    "appointment_type": exception.appointment_type,
                                    "is_available": is_available,
                                }
                            )
            else:
                # Use recurring availability for this day
                day_recurring = recurring.filter(day_of_week=day_of_week)

                for avail in day_recurring:
                    # Check if this recurring availability is valid for this date
                    if avail.valid_until and current_date > avail.valid_until:
                        continue
                    if current_date < avail.valid_from:
                        continue

                    time_slots = AvailabilityService._generate_time_slots(
                        avail.start_time, avail.end_time, avail.duration_minutes
                    )

                    for start, end in time_slots:
                        is_available = (current_date, start, end) not in booked_slots
                        slots.append(
                            {
                                "date": current_date,
                                "start_time": start,
                                "end_time": end,
                                "price_irr": avail.price_irr,
                                "duration_minutes": avail.duration_minutes,
                                "appointment_type": avail.appointment_type,
                                "is_available": is_available,
                            }
                        )

            current_date += timedelta(days=1)

        return slots

    @staticmethod
    def _generate_time_slots(
        start_time: time, end_time: time, duration_minutes: int
    ) -> List[Tuple[time, time]]:
        """
        Generate time slots within a time range.

        Returns:
            List of (start_time, end_time) tuples
        """
        slots = []
        current = datetime.combine(date.today(), start_time)
        end = datetime.combine(date.today(), end_time)
        delta = timedelta(minutes=duration_minutes)

        while current + delta <= end:
            slot_start = current.time()
            slot_end = (current + delta).time()
            slots.append((slot_start, slot_end))
            current += delta

        return slots
