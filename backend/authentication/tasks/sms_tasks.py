from celery import shared_task
from authentication.utils import send_verification_sms
from authentication.constants import SMS_TEMPLATE_ID
import logging

logger = logging.getLogger("otp_api")


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_sms_task(self, phone_number: str, code: str, template_id: int = SMS_TEMPLATE_ID):
    """
    Send SMS asynchronously via Celery.
    Retries on failure up to 3 times.
    """
    try:
        success = send_verification_sms(phone_number, code, template_id)
        if not success:
            raise Exception("SMS sending failed")
    except Exception as exc:
        logger.error(f"Retrying SMS to {phone_number} due to error: {exc}")
        raise self.retry(exc=exc)
