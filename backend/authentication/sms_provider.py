"""Typed, safe results for sms.ir Verify requests and delivery reports."""

from dataclasses import dataclass
import logging

import requests

from authentication.constants import SMS_API_KEY, VERIFY_SMS_API_URL

logger = logging.getLogger("otp_api")

# Never expose raw provider responses to anonymous clients (they may include sensitive data).
ERROR_MESSAGES = {
    10: "کلید وب‌سرویس معتبر نیست.",
    11: "کلید وب‌سرویس غیرفعال است.",
    12: "آی‌پی سرور در فهرست مجاز نیست.",
    13: "حساب پیامکی غیرفعال است.",
    14: "حساب پیامکی تعلیق شده است.",
    20: "محدودیت تعداد درخواست‌های پیامکی اعمال شده است.",
    102: "اعتبار پنل پیامک کافی نیست.",
    104: "شماره موبایل نامعتبر است.",
    113: "قالب پیامک پیدا نشد.",
    115: "شماره موبایل در فهرست سیاه است.",
    116: "نام پارامتر قالب خالی است.",
    117: "متن قالب تأیید نشده است.",
    119: "پلن پیامکی از قالب شخصی پشتیبانی نمی‌کند.",
    123: "خط ارسال‌کننده فعال نیست.",
}

DELIVERY_STATES = {
    1: "رسیده به گوشی",
    2: "نرسیده به گوشی",
    3: "در حال پردازش در مخابرات",
    4: "نرسیده به مخابرات",
    5: "رسیده به مخابرات",
    6: "خطای تحویل",
    7: "فهرست سیاه",
}


@dataclass(frozen=True)
class SmsResult:
    accepted: bool
    provider_status: int | None = None
    message_id: int | None = None
    reason: str = ""
    provider_message: str = ""
    http_status: int | None = None

    def __bool__(self):
        return self.accepted


def send_verification_sms(phone_number: str, code: str, template_id: int) -> SmsResult:
    """Verify API status=1 + a positive messageId means accepted, not delivered."""
    if not SMS_API_KEY or not VERIFY_SMS_API_URL or not template_id:
        logger.error("sms.ir configuration missing")
        return SmsResult(False, reason="configuration_missing")

    try:
        response = requests.post(
            VERIFY_SMS_API_URL,
            headers={"Content-Type": "application/json", "Accept": "application/json", "x-api-key": SMS_API_KEY},
            json={"mobile": phone_number, "templateId": template_id,
                  "parameters": [{"name": "Code", "value": code}]},
            timeout=10,
        )
        result = response.json()
        if not isinstance(result, dict):
            raise ValueError("Invalid provider response")
        # Keep operational status and message ID in server logs, never OTPs or API keys.
        raw_status = result.get("status")
        provider_status = raw_status if type(raw_status) is int else None
        raw_message = result.get("message")
        provider_message = raw_message[:200] if isinstance(raw_message, str) else ""
        raw_id = result.get("data", {}).get("messageId") if isinstance(result.get("data"), dict) else None
        message_id = raw_id if type(raw_id) is int and raw_id > 0 else None
        accepted = response.status_code == 200 and provider_status == 1 and message_id is not None
        logger.log(
            logging.INFO if accepted else logging.WARNING,
            "sms.ir verify http_status=%s provider_status=%s message_id=%s",
            response.status_code, provider_status, message_id,
        )
        reason = "" if accepted else ERROR_MESSAGES.get(provider_status, "پاسخ ناموفق از سرویس پیامک.")
        return SmsResult(
            accepted, provider_status=provider_status,
            message_id=message_id, reason=reason, provider_message=provider_message,
            http_status=response.status_code,
        )
    except (requests.RequestException, ValueError, TypeError, AttributeError) as exc:
        logger.warning("sms.ir verify request failed: %s", type(exc).__name__)
        return SmsResult(False, reason="provider_unreachable")


def get_delivery_status(message_id: int) -> str | None:
    """Look up handset delivery using a messageId from server logs; never log messageText."""
    if not SMS_API_KEY or not isinstance(message_id, int) or message_id <= 0:
        return None
    try:
        response = requests.get(
            f"https://api.sms.ir/v1/send/{message_id}",
            headers={"X-API-KEY": SMS_API_KEY, "Accept": "application/json"},
            timeout=10,
        )
        data = response.json()
        if response.status_code != 200 or data.get("status") != 1:
            logger.warning("sms.ir delivery lookup failed message_id=%s http_status=%s", message_id, response.status_code)
            return None
        state = data.get("data", {}).get("deliveryState")
        return DELIVERY_STATES.get(state, "وضعیت نامشخص") if state is not None else "هنوز وضعیت تحویل مشخص نیست"
    except (requests.RequestException, ValueError, TypeError, AttributeError):
        logger.warning("sms.ir delivery lookup unavailable message_id=%s", message_id)
        return None
