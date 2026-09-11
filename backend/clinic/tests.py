from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from accounts.models import UserModel
from accounts.constants import UserRole
from clinic.models import RecurringAvailabilityModel


class RecurringAvailabilityAPITests(APITestCase):
    def setUp(self):
        self.user = UserModel.objects.create_user(
            phone_number="09123333333",
            password="DoctorStrongPass123!",
            role=UserRole.DOCTOR,
        )
        self.doctor_profile = self.user.doctor_profile
        self.doctor_profile.medical_license_number = "DOC-998877"
        self.doctor_profile.save()

        self.client.force_authenticate(self.user)

        self.availability = RecurringAvailabilityModel.objects.create(
            doctor=self.doctor_profile,
            day_of_week="0",
            start_time="09:00:00",
            end_time="12:00:00",
            price_irr=Decimal(200000),
            duration_minutes=30,
            appointment_type="consultation",
            is_active=True,
        )
        self.detail_url = reverse(
            "recurring-availability-detail", kwargs={"pk": self.availability.pk}
        )

    def test_update_price_and_duration_without_collision(self):
        response = self.client.patch(
            self.detail_url,
            {"price_irr": 350000, "duration_minutes": 45},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.availability.refresh_from_db()
        self.assertEqual(int(self.availability.price_irr), 350000)
        self.assertEqual(self.availability.duration_minutes, 45)

    def test_update_times_successfully(self):
        response = self.client.patch(
            self.detail_url,
            {"start_time": "10:00:00", "end_time": "13:00:00"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.availability.refresh_from_db()
        self.assertEqual(str(self.availability.start_time), "10:00:00")
        self.assertEqual(str(self.availability.end_time), "13:00:00")

    def test_cannot_update_to_conflict_with_another_slot(self):
        RecurringAvailabilityModel.objects.create(
            doctor=self.doctor_profile,
            day_of_week="0",
            start_time="14:00:00",
            end_time="17:00:00",
            price_irr=Decimal(200000),
            duration_minutes=30,
            appointment_type="consultation",
        )
        response = self.client.patch(
            self.detail_url,
            {"start_time": "14:00:00", "end_time": "17:00:00"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("already available", str(response.data))

    def test_delete_recurring_availability(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            RecurringAvailabilityModel.objects.filter(pk=self.availability.pk).exists()
        )
