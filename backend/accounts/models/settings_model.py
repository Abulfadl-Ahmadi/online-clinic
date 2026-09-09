import uuid
from django.db import models
from django.contrib.auth import get_user_model
from accounts.constants import UserLanguage, UserTheme


User = get_user_model()


class SettingsModel(models.Model):
    """
    Model for storing user settings including 2FA configuration
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="settings",
    )

    theme = models.CharField(
        max_length=10, choices=UserTheme.choices, default=UserTheme.SYSTEM
    )
    language = models.CharField(
        max_length=20, choices=UserLanguage.choices, default=UserLanguage.PERSIAN
    )

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.phone_number}'s settings"  # type: ignore

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "User Setting"
        verbose_name_plural = "User Settings"
