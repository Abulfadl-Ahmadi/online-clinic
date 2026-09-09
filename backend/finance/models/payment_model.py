import uuid
from decimal import Decimal

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

from clinic.models import AppointmentModel
from finance.constants import PaymentProvider, PaymentStatus


User = get_user_model()


class PaymentModel(models.Model):
    """
    Payment transaction record.
    NEVER stores card numbers - only references to payment provider.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relationships
    appointment = models.OneToOneField(
        AppointmentModel, on_delete=models.PROTECT, related_name="payment"
    )
    user = models.ForeignKey(User, on_delete=models.PROTECT, related_name="payments")

    # Payment details
    amount_irr = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        validators=[MinValueValidator(0)],
        help_text="Payment amount in Iranian Rial",
    )
    status = models.CharField(
        max_length=30,
        choices=PaymentStatus.choices,
        default=PaymentStatus.PENDING,
        db_index=True,
    )

    # Provider information
    provider = models.CharField(
        max_length=20, choices=PaymentProvider.choices, default=PaymentProvider.ZARINPAL
    )
    provider_payment_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        help_text="Payment ID from payment provider (e.g., Stripe PaymentIntent ID)",
    )
    provider_charge_id = models.CharField(
        max_length=255, blank=True, help_text="Charge ID from payment provider"
    )

    # Idempotency
    idempotency_key = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Unique key for idempotent payment processing",
    )

    # Metadata (DO NOT store sensitive card data)
    payment_method_last4 = models.CharField(
        max_length=4,
        blank=True,
        help_text="Last 4 digits of payment method (for display only)",
    )
    payment_method_brand = models.CharField(
        max_length=20,
        blank=True,
        help_text="Payment method brand (e.g., Visa, Mastercard)",
    )

    # Refund tracking
    refunded_amount_irr = models.DecimalField(
        max_digits=21,
        decimal_places=0,
        default=Decimal("0"),
        validators=[MinValueValidator(0)],
        help_text="Total refunded amount in Iranian Rial",
    )

    # Error handling
    failure_reason = models.TextField(
        blank=True, help_text="Reason for payment failure"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Payment"
        verbose_name_plural = "Payments"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["appointment", "status"]),
            models.Index(fields=["provider_payment_id"]),
        ]

    def __str__(self) -> str:
        return f"Payment {self.id} - {self.status} - {self.amount_irr} IRR"

    @property
    def is_successful(self) -> bool:
        """Check if payment was successful."""
        return self.status == PaymentStatus.SUCCEEDED

    @property
    def can_be_refunded(self) -> bool:
        """Check if payment can be refunded."""
        return (
            self.status == PaymentStatus.SUCCEEDED
            and self.refunded_amount_irr < self.amount_irr
        )

    @property
    def remaining_refundable_amount(self) -> Decimal:
        """Calculate remaining amount that can be refunded."""
        return self.amount_irr - self.refunded_amount_irr
