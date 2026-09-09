import json
import hashlib
import logging
import requests
from django.core.validators import RegexValidator
from authentication.constants import SMS_API_KEY, VERIFY_SMS_API_URL


logger = logging.getLogger("otp_api")


phone_regex = RegexValidator(
    regex=r"^(?:\+?98|0)?9\d{9}$",
    message="Enter a valid Iranian mobile number (09123456789 or +989123456789).",
)


def hash_code(code: str, salt: str) -> str:
    return hashlib.sha256(f"{salt}{code}".encode()).hexdigest()


# TODO: Add custom template id
def send_verification_sms(
    phone_number: str, verification_code: str, template_id: int = 334868
) -> bool:
    """
    Send verification SMS using sms.ir API
    template_id: 334868 for register, 752245 for reset-password
    """
    if not SMS_API_KEY or not VERIFY_SMS_API_URL:
        logger.error("SMS_API_KEY or VERIFY_SMS_API_URL not configured")
        return False

    payload = {
        "mobile": phone_number,
        "templateId": template_id,
        "parameters": [{"name": "Code", "value": verification_code}],
    }

    headers = {
        "Content-Type": "application/json",
        "Accept": "text/plain",
        "x-api-key": SMS_API_KEY,
    }

    try:
        response = requests.post(
            VERIFY_SMS_API_URL, headers=headers, data=json.dumps(payload)
        )
        if response.status_code == 200:
            result = response.json()
            if result.get("status") == 1:
                logger.info(f"SMS sent successfully to {phone_number}")
                return True
            else:
                logger.error(f"SMS sending failed: {result}")
                return False
        else:
            logger.error(f"SMS API error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        logger.exception(f"Error sending SMS to {phone_number}: {e}")
        return False


def send_reset_password_sms(phone_number: str, verification_code: str):
    """Send reset password SMS using templateId 752245"""
    return send_verification_sms(phone_number, verification_code, template_id=752245)
