from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings
from django.core.cache import cache
from django.urls import reverse

from authentication.models import OTPModel
from authentication.constants import OTPType
from authentication.sms_provider import SmsResult, get_delivery_status, send_verification_sms


class OTPFlowTests(TestCase):
    phone = "09123456789"

    def setUp(self):
        self.client.defaults["HTTP_ACCEPT"] = "application/json"
        cache.clear()

    @override_settings(DEBUG=True)
    @patch("authentication.api.views.otp_view.SMS_API_KEY", "")
    def test_unconfigured_provider_does_not_claim_success_or_create_code(self):
        response = self.client.post(reverse("send-otp") + "?type=register", '{"phone_number":"09123456789"}', content_type="application/json")
        self.assertEqual(response.status_code, 503)
        self.assertFalse(OTPModel.objects.exists())

    @patch("authentication.api.views.otp_view.SMS_API_KEY", "test-key")
    @patch("authentication.api.views.otp_view.SMS_TEMPLATE_ID", 123)
    @patch("authentication.api.views.otp_view.VERIFY_SMS_API_URL", "https://example.invalid")
    @patch("authentication.api.views.otp_view.send_verification_sms", return_value=SmsResult(False, provider_status=113, reason="قالب پیامک پیدا نشد.", provider_message="قالب یافت نشد", http_status=400))
    def test_provider_failure_removes_code(self, send):
        response = self.client.post(reverse("send-otp") + "?type=register", '{"phone_number":"09123456789"}', content_type="application/json")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["sms_status"], "rejected")
        self.assertNotIn("provider_message", response.json())
        self.assertFalse(OTPModel.objects.exists())

    @override_settings(DEBUG=True)
    @patch("authentication.api.views.otp_view.SMS_API_KEY", "test-key")
    @patch("authentication.api.views.otp_view.SMS_TEMPLATE_ID", 123)
    @patch("authentication.api.views.otp_view.VERIFY_SMS_API_URL", "https://example.invalid")
    @patch("authentication.api.views.otp_view.send_verification_sms", return_value=SmsResult(True, 1, 89545112, provider_message="موفق", http_status=200))
    def test_provider_acceptance_reports_pending_delivery(self, send):
        response = self.client.post(reverse("send-otp") + "?type=register", '{"phone_number":"09123456789"}', content_type="application/json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["sms_status"], "accepted")
        self.assertNotIn("message_id", response.json())
        self.assertNotIn("provider_message", response.json())
        self.assertTrue(OTPModel.objects.exists())

    def test_cross_purpose_code_cannot_register(self):
        otp = OTPModel.generate_otp(self.phone, type=OTPType.LOGIN)
        response = self.client.post(reverse("verify-otp") + "?type=register", '{"phone_number":"09123456789","code":"' + otp.plain_code + '"}', content_type="application/json")
        self.assertEqual(response.status_code, 400)
        self.assertFalse(get_user_model().objects.filter(phone_number=self.phone).exists())

    def test_reset_password_requires_reset_purpose_code(self):
        user = get_user_model().objects.create_user(phone_number=self.phone, password="old-password-123")
        otp = OTPModel.generate_otp(self.phone, type=OTPType.LOGIN)
        response = self.client.post(reverse("reset-password"), '{"phone_number":"09123456789","code":"' + otp.plain_code + '","new_password":"new-password-456"}', content_type="application/json")
        self.assertEqual(response.status_code, 400)
        user.refresh_from_db()
        self.assertTrue(user.check_password("old-password-123"))

    def test_reset_password_with_valid_reset_code(self):
        user = get_user_model().objects.create_user(phone_number=self.phone, password="old-password-123")
        otp = OTPModel.generate_otp(self.phone, type=OTPType.RESET_PASSWORD)
        response = self.client.post(reverse("reset-password"), '{"phone_number":"09123456789","code":"' + otp.plain_code + '","new_password":"new-password-456"}', content_type="application/json")
        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password("new-password-456"))
        otp.refresh_from_db()
        self.assertTrue(otp.is_used)


class SmsProviderTests(TestCase):
    @patch("authentication.sms_provider.SMS_API_KEY", "test-key")
    @patch("authentication.sms_provider.VERIFY_SMS_API_URL", "https://api.sms.ir/v1/send/verify")
    @patch("authentication.sms_provider.requests.post")
    def test_acceptance_requires_positive_message_id(self, post):
        post.return_value = Mock(status_code=200)
        post.return_value.json.return_value = {"status": 1, "message": "موفق", "data": {"messageId": 89545112, "cost": 1.0}}
        result = send_verification_sms("09123456789", "123456", 42)
        self.assertEqual(result, SmsResult(True, 1, 89545112, provider_message="موفق", http_status=200))
        post.return_value.json.return_value = {"status": 1, "data": {}}
        self.assertFalse(send_verification_sms("09123456789", "123456", 42).accepted)

    @patch("authentication.sms_provider.SMS_API_KEY", "test-key")
    @patch("authentication.sms_provider.VERIFY_SMS_API_URL", "https://api.sms.ir/v1/send/verify")
    @patch("authentication.sms_provider.requests.post")
    def test_provider_template_error_is_classified(self, post):
        post.return_value = Mock(status_code=400)
        post.return_value.json.return_value = {"status": 113, "message": "قالب یافت نشد", "data": None}
        result = send_verification_sms("09123456789", "123456", 42)
        self.assertFalse(result.accepted)
        self.assertEqual(result.provider_status, 113)
        self.assertEqual(result.reason, "قالب پیامک پیدا نشد.")
        self.assertEqual(result.provider_message, "قالب یافت نشد")
        self.assertEqual(result.http_status, 400)

    @patch("authentication.sms_provider.SMS_API_KEY", "test-key")
    @patch("authentication.sms_provider.requests.get")
    def test_delivery_is_separate_from_acceptance(self, get):
        get.return_value = Mock(status_code=200)
        get.return_value.json.return_value = {"status": 1, "data": {"messageId": 89545112, "deliveryState": 1, "messageText": "secret"}}
        self.assertEqual(get_delivery_status(89545112), "رسیده به گوشی")
