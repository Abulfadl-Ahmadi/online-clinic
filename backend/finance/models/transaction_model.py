import uuid
from django.db import models
from django.conf import settings

from finance.constants import TransactionCurrency, TransactionStatus


class TransactionModel(models.Model):
    """
    Model for handling payment transactions using Zarinpal gateway.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # User who initiated the transaction
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transactions",
        help_text="User who made the payment",
    )

    # Payment amount and currency
    amount = models.PositiveBigIntegerField(
        help_text="Payment amount in the smallest currency unit (Rial/Toman)"
    )
    currency = models.CharField(
        max_length=3,
        choices=TransactionCurrency.choices,
        default=TransactionCurrency.IRR,
        help_text="Currency of the transaction",
    )

    # Transaction details
    description = models.TextField(help_text="Description of the transaction")
    authority = models.CharField(
        max_length=36, unique=True, help_text="Unique authority code from Zarinpal"
    )
    ref_id = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Reference ID from successful payment verification",
    )

    # Payment status
    status = models.CharField(
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING,
        db_index=True,
        help_text="Current status of the transaction",
    )

    # Payment details from verification
    card_pan = models.CharField(
        max_length=19,
        blank=True,
        null=True,
        help_text="Masked card number used for payment",
    )
    fee = models.PositiveIntegerField(
        default=0, help_text="Transaction fee charged by Zarinpal"
    )

    # Optional user contact information
    mobile = models.CharField(
        max_length=15, blank=True, null=True, help_text="User's mobile number"
    )
    email = models.EmailField(blank=True, null=True, help_text="User's email address")

    # Callback URL for payment completion
    callback_url = models.URLField(
        help_text="URL to redirect user after payment completion"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Transaction"
        verbose_name_plural = "Transactions"
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["authority"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"Transaction {self.authority} - {self.amount} {self.currency} - {self.status}"

    @property
    def is_successful(self):
        """Check if transaction was successful."""
        return self.status == TransactionStatus.PAID

    @property
    def amount_display(self):
        """Display amount with currency symbol."""
        currency_symbols = {
            TransactionCurrency.IRR: "ریال",
            TransactionCurrency.IRT: "تومان",
        }
        symbol = currency_symbols.get(self.currency, self.currency)  # type: ignore
        return f"{self.amount:,} {symbol}"
