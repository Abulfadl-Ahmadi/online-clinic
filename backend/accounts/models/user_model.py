import uuid
from accounts.managers import UserManager
from accounts.constants import UserRole, UserStatus

from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from accounts.utils import normalize_phone_number


class UserModel(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that replaces Django's default user model.
    """

    # UUID field used as the primary key, automatically generated and not editable by users.
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Phone number for the user
    phone_number = models.CharField(
        unique=True,
        max_length=15,
        validators=[
            RegexValidator(
                regex=r"^(?:\+?98|0)?9\d{9}$",
                message="Enter a valid Iranian phone number (e.g. 09123456789 or +989123456789).",
                code="invalid_phone_number",
            )
        ],
        help_text="Valid Iranian mobile number (09xxxxxxxxx or +989xxxxxxxxx).",
    )
    # Status for the user (active, banned, deleted)
    status = models.CharField(
        max_length=20,
        choices=UserStatus.choices,
        default=UserStatus.ACTIVE,
        db_index=True,
    )
    # Role for the user (admin, user, menu owner)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.USER,
        db_index=True,
    )
    # Timestamps for user creation and last update
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_staff(self) -> bool:
        """Check if the user is staff."""
        status: bool = self.role == UserRole.ADMIN
        return status

    @property
    def is_active(self) -> bool:
        """Check if the user is active."""
        status: bool = self.status == UserStatus.ACTIVE
        return status

    @property
    def is_deleted(self) -> bool:
        """Check if the user is deleted."""
        # Check if the user is deleted and has a deleted_at timestamp
        status: bool = self.status == UserStatus.DELETED and self.deleted_at is not None
        return status

    # Attach the custom manager
    objects = UserManager()

    USERNAME_FIELD = "phone_number"

    class Meta:
        """Meta class for the UserModel."""

        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.phone_number

    def soft_delete(self):
        """Soft delete the user, marking it as deleted."""
        self.status = UserStatus.DELETED
        self.deleted_at = timezone.now()
        self.save()

    def generate_jwt_token(self):
        """
        Generate JWT tokens (access and refresh) and include additional data
        """
        token = RefreshToken.for_user(self)

        # Add custom claims to the token
        token["id"] = str(self.id)
        token["role"] = self.role

        return token

    def save(self, *args, **kwargs):
        # normalize phone number
        self.phone_number = normalize_phone_number(self.phone_number)
        super().save(*args, **kwargs)
