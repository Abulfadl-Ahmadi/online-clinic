class SchedulingError(Exception):
    """Base exception for scheduling errors."""

    pass


class SlotNotAvailableError(SchedulingError):
    """Raised when requested time slot is not available."""

    pass


class DoubleBookingError(SchedulingError):
    """Raised when a double-booking is detected."""

    pass


class InvalidTimeSlotError(SchedulingError):
    """Raised when time slot is invalid (e.g., past date, invalid times)."""

    pass
