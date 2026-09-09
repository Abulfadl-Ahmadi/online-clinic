import uuid

from django.db import models
from django.utils import timezone
from django.contrib.auth import get_user_model

from finance.constants import PaymentProvider


User = get_user_model()


class WebhookEventModel(models.Model):
    """
    Webhook event log for payment provider callbacks.
    Ensures idempotent processing of webhook events.
    """

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    # Event identification
    provider = models.CharField(max_length=20, choices=PaymentProvider.choices)
    provider_event_id = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Unique event ID from payment provider",
    )
    event_type = models.CharField(
        max_length=100, help_text="Event type (e.g., payment_intent.succeeded)"
    )

    # Processing status
    processed = models.BooleanField(
        default=False, db_index=True, help_text="Whether this event has been processed"
    )
    processed_at = models.DateTimeField(null=True, blank=True)

    # Event data
    payload = models.JSONField(help_text="Full webhook payload for debugging")

    # Error handling
    processing_error = models.TextField(
        blank=True, help_text="Error message if processing failed"
    )
    retry_count = models.PositiveIntegerField(
        default=0, help_text="Number of processing attempts"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Webhook Event"
        verbose_name_plural = "Webhook Events"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["provider", "processed"]),
            models.Index(fields=["event_type", "processed"]),
        ]

    def __str__(self) -> str:
        return f"{self.provider} - {self.event_type} - {self.provider_event_id}"

    def mark_as_processed(self):
        """Mark webhook event as successfully processed."""
        self.processed = True
        self.processed_at = timezone.now()
        self.save(update_fields=["processed", "processed_at", "updated_at"])

    def mark_as_failed(self, error_message: str):
        """Mark webhook event as failed with error message."""
        self.processing_error = error_message
        self.retry_count += 1
        self.save(update_fields=["processing_error", "retry_count", "updated_at"])
