import uuid
import random
import secrets
from django.db import models
from datetime import timedelta
from django.db.models import F
from django.utils import timezone
from django.core.validators import RegexValidator

from authentication.utils import hash_code
from accounts.utils import normalize_phone_number
from authentication.constants import (
    OTP_LENGTH,
    OTP_EXPIRY_MINUTES,
    MAX_VERIFY_ATTEMPTS,
    OTPType,
)


class OTPModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    phone_number = models.CharField(
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

    type = models.CharField(
        max_length=32, choices=OTPType.choices, default=OTPType.LOGIN
    )

    salt = models.CharField(max_length=32)
    code_hash = models.CharField(max_length=64)  # sha256 hex

    is_used = models.BooleanField(default=False)
    attempts = models.PositiveSmallIntegerField(default=0)

    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "OTP"
        verbose_name_plural = "OTPs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["phone_number", "-created_at"]),
        ]

    @property
    def expired(self) -> bool:
        return timezone.now() > self.created_at + timedelta(minutes=OTP_EXPIRY_MINUTES)

    def check_code(self, code: str) -> bool:
        """
        Returns True if code matches and not expired/used.
        Increments attempt count each time it's called.
        """
        if self.is_used or self.expired:
            return False

        if self.attempts > MAX_VERIFY_ATTEMPTS:
            return False

        OTPModel.objects.filter(pk=self.pk).update(attempts=F("attempts") + 1)
        self.refresh_from_db(fields=["attempts"])

        return hash_code(code, self.salt) == self.code_hash

    def mark_used(self):
        if not self.is_used:
            self.is_used = True
            self.save(update_fields=["is_used"])

    @classmethod
    def generate_otp(
        cls, phone_number: str, type: OTPType = OTPType.LOGIN
    ) -> "OTPModel":
        """Create and return an OTP instance (hashed)."""
        phone_number = normalize_phone_number(phone_number)
        # Delete any expired or used OTPs
        cls.objects.filter(phone_number=phone_number).filter(
            models.Q(is_used=True)
            | models.Q(
                created_at__lt=timezone.now() - timedelta(minutes=OTP_EXPIRY_MINUTES)
            )
        ).delete()

        # Generate a new code
        code = f"{random.randint(0, 10**OTP_LENGTH - 1):0{OTP_LENGTH}d}"
        # Hash the code and create the OTP instance
        salt = secrets.token_hex(16)
        code_hash = hash_code(code, salt)
        otp = cls.objects.create(
            phone_number=phone_number, type=type, code_hash=code_hash, salt=salt
        )
        # return both the model and the plaintext code so sending can occur
        otp.plain_code = code  # type: ignore # attach temporarily (not persisted)
        return otp

    def save(self, *args, **kwargs):
        # normalize phone number
        self.phone_number = normalize_phone_number(self.phone_number)
        super().save(*args, **kwargs)
