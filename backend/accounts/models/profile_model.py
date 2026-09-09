import os
import uuid
from PIL import Image
from django.db import models
from django_cleanup import cleanup
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

from accounts.constants import ALLOWED_EXTENSIONS, UserGender, MAX_AVATAR_SIZE

User = get_user_model()

size_limit = MAX_AVATAR_SIZE * 1024 * 1024


def profile_avatar_upload_to(instance, filename):
    """Generate a unique upload path for avatar images."""
    # Get the file extension
    ext = os.path.splitext(filename)[1]

    # Create a new filename (e.g., a UUID)
    new_filename = f"{uuid.uuid4()}{ext}"

    # Use the project's name for the folder structure
    return f"accounts/avatar_images/{instance.user.id}/{new_filename}"


@cleanup.select
class ProfileModel(models.Model):

    # UUID field used as the primary key, automatically generated and not editable by users.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # One-to-one relationship with the User model.
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    avatar = models.ImageField(upload_to=profile_avatar_upload_to, blank=True)

    national_code = models.CharField(
        max_length=10, help_text="National code", blank=True, null=True
    )

    last_name = models.CharField(max_length=50, blank=True, null=True)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)

    gender = models.CharField(
        max_length=10, choices=UserGender.choices, default=UserGender.OTHER
    )

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return f"{self.user.phone_number}'s profile"  # type: ignore

    def clean(self):
        super().clean()

        # Validate the avatar image file type and size
        if self.avatar:
            ext = self.avatar.name.split(".")[-1].lower()
            if ext not in ALLOWED_EXTENSIONS:
                raise ValidationError(
                    "Unsupported file extension. Supported extensions are: jpg, jpeg, png!"
                )

            if self.avatar.size > size_limit:
                raise ValidationError(
                    f"Avatar image file is too large (more than {size_limit / 1024 / 1024} MB)!"
                )

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)


@receiver(models.signals.post_save, sender=ProfileModel)
def resize_image(sender, instance, **kwargs):
    """Resize the avatar image if it's larger than 512x512 pixels."""
    if instance.avatar:
        img = Image.open(instance.avatar.path)
        if img.width > 512 or img.height > 512:
            img.thumbnail((512, 512))
            img.save(instance.avatar.path)
