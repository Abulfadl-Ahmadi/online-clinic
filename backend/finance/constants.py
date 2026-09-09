from django.db import models


class TransactionStatus(models.TextChoices):
    PENDING = "pending", "در انتظار پرداخت"
    PAID = "paid", "موفق"
    FAILED = "failed", "ناموفق"
    REFUNDED = "refunded", "مسترد شده"
    CANCELLED = "cancelled", "لغو شده"


class TransactionCurrency(models.TextChoices):
    IRR = "IRR", "ریال"
    IRT = "IRT", "تومان"


class PaymentStatus(models.TextChoices):
    """Payment transaction status."""

    PENDING = "pending", "در انتظار پرداخت"
    PROCESSING = "processing", "در حال پردازش"
    SUCCEEDED = "succeeded", "موفق"
    FAILED = "failed", "ناموفق"
    REFUNDED = "refunded", "مسترد شده"
    PARTIALLY_REFUNDED = "partially_refunded", "استرداد جزئی"
    CANCELLED = "cancelled", "لغو شده"


class PaymentProvider(models.TextChoices):
    """Supported payment providers."""

    ZARINPAL = "Zarinpal", "زرین‌پال"
    # Add other providers as needed
