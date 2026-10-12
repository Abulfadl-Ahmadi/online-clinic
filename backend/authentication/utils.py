import hashlib
from django.core.validators import RegexValidator
from authentication.constants import SMS_TEMPLATE_ID, RESET_PASSWORD_SMS_TEMPLATE_ID
from authentication.sms_provider import send_verification_sms as send_sms_ir_verification


phone_regex = RegexValidator(
    regex=r"^(?:\+?98|0)?9\d{9}$",
    message="Enter a valid Iranian mobile number (09123456789 or +989123456789).",
)


def hash_code(code: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}{code}".encode()).hexdigest()


def send_verification_sms(
    phone_number: str, verification_code: str, template_id: int = SMS_TEMPLATE_ID
) -> bool:
    """Compatibility wrapper for existing Celery callers."""
    return bool(send_sms_ir_verification(phone_number, verification_code, template_id))


def send_reset_password_sms(phone_number: str, verification_code: str):
    """Send reset-password SMS using its configured template ID."""
    return send_verification_sms(
        phone_number, verification_code, template_id=RESET_PASSWORD_SMS_TEMPLATE_ID
    )
