from django.contrib import admin
from clinic.models import AppointmentModel


@admin.register(AppointmentModel)
class AppointmentAdmin(admin.ModelAdmin):
    """Admin for Appointment model."""

    list_display = [
        "doctor",
        "patient_phone",
        "appointment_date",
        "start_time",
        "status",
        "price_irr",
        "payment_status",
        "created_at",
    ]
    list_filter = ["status", "appointment_type", "appointment_date", "created_at"]
    search_fields = [
        "doctor__user__phone_number",
        "patient__phone_number",
        "patient_notes",
        "doctor_notes",
    ]
    readonly_fields = ["created_at", "updated_at", "confirmed_at", "cancelled_at"]
    date_hierarchy = "appointment_date"

    fieldsets = (
        (
            "Appointment Details",
            {
                "fields": (
                    "doctor",
                    "patient",
                    "appointment_date",
                    "start_time",
                    "end_time",
                )
            },
        ),
        ("Type & Pricing", {"fields": ("appointment_type", "price_irr", "status")}),
        ("Notes", {"fields": ("patient_notes", "doctor_notes", "cancellation_reason")}),
        (
            "Timestamps",
            {
                "fields": ("created_at", "updated_at", "confirmed_at", "cancelled_at"),
                "classes": ("collapse",),
            },
        ),
    )

    def patient_phone(self, obj):
        return obj.patient.phone_number

    patient_phone.short_description = "Patient"

    def payment_status(self, obj):
        """Display payment status."""
        try:
            payment = obj.payment
            return f"{payment.get_status_display()} ({payment.amount_irr:,} IRR)"
        except:
            return "No payment"
    payment_status.short_description = "Payment"

    actions = ["mark_completed", "mark_no_show"]

    def mark_completed(self, request, queryset):
        """Mark appointments as completed."""
        updated = queryset.filter(status__in=["confirmed"]).update(status="completed")
        self.message_user(request, f"{updated} appointments marked as completed.")

    mark_completed.short_description = "Mark as completed"

    def mark_no_show(self, request, queryset):
        """Mark appointments as no-show."""
        updated = queryset.filter(status__in=["confirmed"]).update(status="no_show")
        self.message_user(request, f"{updated} appointments marked as no-show.")

    mark_no_show.short_description = "Mark as no-show"
