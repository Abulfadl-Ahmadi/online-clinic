"""
Celery tasks for appointment management.
"""
import logging
from datetime import timedelta
from django.utils import timezone
from celery import shared_task

from clinic.models import AppointmentModel
from clinic.constants import AppointmentStatus

logger = logging.getLogger("appointment_tasks")


@shared_task(name="clinic.expire_pending_appointments")
def expire_pending_appointments():
    """
    Expire pending appointments that haven't been paid within 15 minutes.
    
    This task should be run periodically (e.g., every 5 minutes) to clean up
    appointments where users started the booking process but didn't complete payment.
    """
    # Find pending appointments older than 15 minutes
    expiry_threshold = timezone.now() - timedelta(minutes=15)
    
    expired_appointments = AppointmentModel.objects.filter(
        status=AppointmentStatus.PENDING,
        created_at__lt=expiry_threshold,
    )
    
    count = expired_appointments.count()
    
    if count > 0:
        # Update status to cancelled
        expired_appointments.update(
            status=AppointmentStatus.CANCELLED,
            cancellation_reason="Payment timeout - appointment not confirmed within 15 minutes",
            cancelled_at=timezone.now(),
        )
        
        logger.info(f"Expired {count} pending appointments due to payment timeout")
    else:
        logger.debug("No pending appointments to expire")
    
    return {
        "expired_count": count,
        "timestamp": timezone.now().isoformat(),
    }
