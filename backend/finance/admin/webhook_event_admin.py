from django.contrib import admin
from finance.models import WebhookEventModel


@admin.register(WebhookEventModel)
class WebhookEventAdmin(admin.ModelAdmin):
    """Admin for WebhookEvent model."""

    list_display = [
        "id",
        "provider",
        "event_type",
        "processed",
        "retry_count",
        "created_at",
    ]
    list_filter = ["provider", "processed", "event_type", "created_at"]
    search_fields = ["provider_event_id", "event_type", "processing_error"]
    readonly_fields = [
        "created_at",
        "updated_at",
        "processed_at",
        "provider_event_id",
        "payload",
    ]

    fieldsets = (
        ("Event Details", {"fields": ("provider", "provider_event_id", "event_type")}),
        ("Processing Status", {"fields": ("processed", "processed_at", "retry_count")}),
        (
            "Error Information",
            {"fields": ("processing_error",), "classes": ("collapse",)},
        ),
        ("Payload", {"fields": ("payload",), "classes": ("collapse",)}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def has_add_permission(self, request):
        """Webhooks are created automatically."""
        return False

    def has_delete_permission(self, request, obj=None):
        """Keep webhook events for audit trail."""
        return request.user.is_superuser
