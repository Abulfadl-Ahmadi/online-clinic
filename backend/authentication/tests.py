from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.core.cache import cache
from django.urls import reverse

from authentication.models import OTPModel
from authentication.constants import OTPType


class OTPFlowTests(TestCase):
    phone = "09123456789"

    def setUp(self):
        self.client.defaults["HTTP_ACCEPT"] = "application/json"
        cache.clear()

    @patch("authentication.api.views.otp_view.SMS_API_KEY", "")
    @patch("authentication.api.views.otp_view.settings.DEBUG", False)
    def test_unconfigured_provider_does_not_claim_success_or_create_code(self):
        response = self.client.post(reverse("send-otp") + "?type=register", '{"phone_number":"09123456789"}', content_type="application/json")
        self.assertEqual(response.status_code, 503)
        self.assertFalse(OTPModel.objects.exists())

    @patch("authentication.api.views.otp_view.SMS_API_KEY", "test-key")
    @patch("authentication.api.views.otp_view.SMS_TEMPLATE_ID", 123)
    @patch("authentication.api.views.otp_view.VERIFY_SMS_API_URL", "https://example.invalid")
    @patch("authentication.api.views.otp_view.settings.DEBUG", False)
    @patch("authentication.api.views.otp_view.send_verification_sms", return_value=False)
    def test_provider_failure_removes_code(self, send):
        response = self.client.post(reverse("send-otp") + "?type=register", '{"phone_number":"09123456789"}', content_type="application/json")
        self.assertEqual(response.status_code, 503)
        self.assertFalse(OTPModel.objects.exists())

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
