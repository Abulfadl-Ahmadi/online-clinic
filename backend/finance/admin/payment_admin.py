from django.contrib import admin
from django.utils.html import format_html
from finance.models import PaymentModel
from finance.constants import PaymentStatus


@admin.action(description="Mark selected payments as succeeded")
def mark_as_succeeded(modeladmin, request, queryset):
    queryset.update(status=PaymentStatus.SUCCEEDED)


@admin.action(description="Mark selected payments as failed")
def mark_as_failed(modeladmin, request, queryset):
    queryset.update(status=PaymentStatus.FAILED)


@admin.register(PaymentModel)
class PaymentAdmin(admin.ModelAdmin):
    """Admin configuration for PaymentModel"""

    list_display = [
        "id",
        "appointment_link",
        "user_phone",
        "amount_irr_display",
        "status_colored",
        "provider",
        "paid_at",
        "created_at",
    ]

    list_filter = [
        "status",
        "provider",
        "created_at",
        "paid_at",
    ]

    search_fields = [
        "id",
        "appointment__id",
        "user__phone_number",
        "provider_payment_id",
    ]

    readonly_fields = [
        "id",
        "idempotency_key",
        "provider_payment_id",
        "provider_charge_id",
        "paid_at",
        "refunded_at",
        "created_at",
        "updated_at",
    ]

    fieldsets = (
        (
            "Payment Details",
            {"fields": ("appointment", "user", "amount_irr", "status")},
        ),
        (
            "Provider Information",
            {"fields": ("provider", "provider_payment_id", "provider_charge_id")},
        ),
        (
            "Payment Method",
            {"fields": ("payment_method_last4", "payment_method_brand")},
        ),
        ("Refund Information", {"fields": ("refunded_amount_irr", "failure_reason")}),
        (
            "Timestamps",
            {
                "fields": ("paid_at", "refunded_at", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )

    actions = [mark_as_succeeded, mark_as_failed]

    def appointment_link(self, obj):
        """Link to the related appointment."""
        if obj.appointment:
            return format_html(
                '<a href="/admin/clinic/appointmentmodel/{}/change/">Appointment {}</a>',
                obj.appointment.id,
                obj.appointment.id,
            )
        return "No appointment"

    appointment_link.short_description = "Appointment"

    def user_phone(self, obj):
        """Display user phone number."""
        return obj.user.phone_number

    user_phone.short_description = "User Phone"

    def amount_irr_display(self, obj):
        """Display amount with currency."""
        return f"{obj.amount_irr:,} IRR"

    amount_irr_display.short_description = "Amount"

    def status_colored(self, obj):
        """Display status with color coding."""
        colors = {
            PaymentStatus.PENDING: "orange",
            PaymentStatus.PROCESSING: "blue",
            PaymentStatus.SUCCEEDED: "green",
            PaymentStatus.FAILED: "red",
            PaymentStatus.REFUNDED: "purple",
            PaymentStatus.PARTIALLY_REFUNDED: "orange",
            PaymentStatus.CANCELLED: "gray",
        }
        color = colors.get(obj.status, "black")
        return format_html(
            '<span style="color: {};">{}</span>', color, obj.get_status_display()
        )

    status_colored.short_description = "Status"

    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of payment records."""
        return True
