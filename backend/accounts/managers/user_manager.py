from accounts.utils import normalize_phone_number
from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    """
    Custom manager for the UserModel, handling user and superuser creation.
    """

    def create_user(self, phone_number=None, password=None, **extra_fields):
        """
        Creates and returns a regular user.
        """
        # Ensure that the user has a phone_number
        if not phone_number:
            raise ValueError("Users must have a phone number")

        # Ensure that the user has a password
        if not password:
            raise ValueError("Users must have a password")

        # Normalize to +989xxxxxxxxx format
        phone_number = normalize_phone_number(phone_number)

        # Create the user instance with the provided details
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)  # Hash the password before saving
        user.save(using=self._db)  # Save the user to the database

        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        """
        Creates and returns a superuser with all permissions.
        """
        user = self.create_user(
            phone_number=phone_number, password=password, **extra_fields
        )
        # Assign superuser status
        user.is_superuser = True
        # Allow admin panel access
        user.role = "admin"
        # Set user status to active
        user.status = "active"

        user.save(using=self._db)

        return user
