from django.contrib import admin
from django.utils.html import format_html

from finance.models import TransactionModel, TransactionStatus


@admin.action(description="Mark selected transactions as paid")
def mark_as_paid(modeladmin, request, queryset):
    queryset.update(status=TransactionStatus.PAID)


@admin.action(description="Mark selected transactions as failed")
def mark_as_failed(modeladmin, request, queryset):
    queryset.update(status=TransactionStatus.FAILED)


@admin.register(TransactionModel)
class TransactionAdmin(admin.ModelAdmin):
    """Admin configuration for TransactionModel"""

    list_display = [
        "authority",
        "user",
        "amount_display",
        "status_colored",
        "created_at",
        "ref_id",
    ]

    list_filter = [
        "status",
        "currency",
        "created_at",
    ]

    search_fields = [
        "authority",
        "ref_id",
        "user__phone_number",
        "description",
    ]

    readonly_fields = [
        "id",
        "authority",
        "ref_id",
        "card_pan",
        "fee",
        "created_at",
        "updated_at",
    ]

    fieldsets = (
        ("Basic Information", {
            "fields": ("id", "user", "amount", "currency", "description")
        }),
        ("Transaction Details", {
            "fields": ("authority", "ref_id", "status", "card_pan", "fee")
        }),
        ("Contact Information", {
            "fields": ("mobile", "email", "callback_url")
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",)
        }),
    )

    actions = [mark_as_paid, mark_as_failed]

    def status_colored(self, obj):
        """Display status with color coding."""
        colors = {
            TransactionStatus.PENDING: "orange",
            TransactionStatus.PAID: "green",
            TransactionStatus.FAILED: "red",
            TransactionStatus.REFUNDED: "blue",
            TransactionStatus.CANCELLED: "gray",
        }
        color = colors.get(obj.status, "black")
        return format_html(
            '<span style="color: {};">{}</span>',
            color,
            obj.get_status_display()
        )

    status_colored.short_description = "Status"
    status_colored.admin_order_field = "status"

    def get_queryset(self, request):
        """Optimize queryset with select_related for user."""
        return super().get_queryset(request).select_related('user')