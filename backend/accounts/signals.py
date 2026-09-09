"""Signal handlers for the accounts app."""

from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save

from accounts.constants import UserRole
from accounts.models import ProfileModel, SettingsModel, DoctorProfileModel


User = get_user_model()


@receiver(post_save, sender=User)
def create(sender, instance, created, **kwargs):
    """Create needed models for new users."""
    if created:
        ProfileModel.objects.get_or_create(user=instance)
        SettingsModel.objects.get_or_create(user=instance)

        if instance.role == UserRole.DOCTOR:
            DoctorProfileModel.objects.get_or_create(user=instance)
