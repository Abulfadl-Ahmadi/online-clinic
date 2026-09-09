import uuid

from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator

from .payment_model import PaymentModel
from finance.constants import PaymentStatus


User = get_user_model()


class RefundModel(models.Model):
    """
    Refund transaction record.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Relationships
    payment = models.ForeignKey(
        PaymentModel, on_delete=models.PROTECT, related_name="refunds"
    )

    # Refund details
    amount_irr = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        validators=[MinValueValidator(0)],
        help_text="Refund amount in Iranian Rial",
    )
    reason = models.TextField(help_text="Reason for refund")

    # Provider information
    provider_refund_id = models.CharField(
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        help_text="Refund ID from payment provider",
    )

    # Status
    status = models.CharField(
        max_length=30, choices=PaymentStatus.choices, default=PaymentStatus.PENDING
    )

    # Admin tracking
    created_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="refunds_created",
        help_text="Admin who initiated the refund",
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Refund"
        verbose_name_plural = "Refunds"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["payment", "status"]),
        ]

    def __str__(self) -> str:
        return f"Refund {self.id} - {self.amount_irr} IRR for Payment {self.payment}"
