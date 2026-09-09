from django.contrib import admin
from finance.models import RefundModel


@admin.register(RefundModel)
class RefundAdmin(admin.ModelAdmin):
    """Admin for Refund model."""

    list_display = [
        "id",
        "payment",
        "amount_irr",
        "status",
        "created_by_phone",
        "created_at",
    ]
    list_filter = ["status", "created_at"]
    search_fields = ["payment__id", "reason", "provider_refund_id"]
    readonly_fields = ["created_at", "updated_at", "processed_at", "provider_refund_id"]

    fieldsets = (
        ("Refund Details", {"fields": ("payment", "amount_irr", "status")}),
        ("Reason", {"fields": ("reason",)}),
        ("Provider Information", {"fields": ("provider_refund_id",)}),
        ("Admin Information", {"fields": ("created_by",)}),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at", "processed_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def created_by_phone(self, obj):
        return obj.created_by.phone_number

    created_by_phone.short_description = "Created By"

    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of refund records."""
        return False
