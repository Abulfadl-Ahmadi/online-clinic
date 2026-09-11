from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import authenticate
from accounts.models import UserModel
from accounts.constants import UserRole


class ChangePasswordAPITests(APITestCase):
    def setUp(self):
        self.user_password = "OldStrongPassword123!"
        self.user = UserModel.objects.create_user(
            phone_number="09121111111",
            password=self.user_password,
            role=UserRole.USER,
        )
        self.doctor = UserModel.objects.create_user(
            phone_number="09122222222",
            password=self.user_password,
            role=UserRole.DOCTOR,
        )
        self.accounts_url = reverse("me-change-password")
        self.auth_url = reverse("change-password")

    def test_unauthenticated_user_cannot_change_password(self):
        response = self.client.post(
            self.accounts_url,
            {
                "old_password": self.user_password,
                "new_password": "NewStrongPassword456!",
                "confirm_new_password": "NewStrongPassword456!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_successful_password_change_user_role(self):
        self.client.force_authenticate(self.user)
        new_pass = "NewStrongPassword456!"
        response = self.client.post(
            self.accounts_url,
            {
                "old_password": self.user_password,
                "new_password": new_pass,
                "confirm_new_password": new_pass,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))

        # Verify old password no longer works
        self.user.refresh_from_db()
        self.assertFalse(self.user.check_password(self.user_password))
        self.assertTrue(self.user.check_password(new_pass))

        # Verify authentication
        auth_user = authenticate(username=self.user.phone_number, password=new_pass)
        self.assertIsNotNone(auth_user)

    def test_successful_password_change_doctor_role(self):
        self.client.force_authenticate(self.doctor)
        new_pass = "DoctorNewPassword789@"
        response = self.client.post(
            self.accounts_url,
            {
                "old_password": self.user_password,
                "new_password": new_pass,
                "confirm_new_password": new_pass,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))

        self.doctor.refresh_from_db()
        self.assertTrue(self.doctor.check_password(new_pass))

    def test_successful_password_change_via_auth_url(self):
        self.client.force_authenticate(self.user)
        new_pass = "BrandNewPass999!"
        response = self.client.post(
            self.auth_url,
            {
                "old_password": self.user_password,
                "new_password": new_pass,
                "confirm_new_password": new_pass,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data.get("success"))

    def test_camel_case_keys_support(self):
        self.client.force_authenticate(self.user)
        new_pass = "CamelCasePass888!"
        response = self.client.post(
            self.accounts_url,
            {
                "oldPassword": self.user_password,
                "newPassword": new_pass,
                "confirmNewPassword": new_pass,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_pass))

    def test_wrong_old_password_fails(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            self.accounts_url,
            {
                "old_password": "WrongPassword123!",
                "new_password": "NewStrongPassword456!",
                "confirm_new_password": "NewStrongPassword456!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        self.assertIn("نادرست", response.data.get("message", ""))

    def test_mismatched_new_password_fails(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            self.accounts_url,
            {
                "old_password": self.user_password,
                "new_password": "NewStrongPassword456!",
                "confirm_new_password": "DifferentPassword456!",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        self.assertIn("یکسان", response.data.get("message", ""))

    def test_same_new_and_old_password_fails(self):
        self.client.force_authenticate(self.user)
        response = self.client.post(
            self.accounts_url,
            {
                "old_password": self.user_password,
                "new_password": self.user_password,
                "confirm_new_password": self.user_password,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data.get("success"))
        self.assertIn("مشابه", response.data.get("message", ""))

    def test_put_method_also_works(self):
        self.client.force_authenticate(self.user)
        new_pass = "PutMethodPass555!"
        response = self.client.put(
            self.accounts_url,
            {
                "old_password": self.user_password,
                "new_password": new_pass,
                "confirm_new_password": new_pass,
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(new_pass))
