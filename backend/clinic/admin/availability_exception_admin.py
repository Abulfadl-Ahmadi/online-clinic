from django.contrib import admin
from clinic.models import AvailabilityExceptionModel


@admin.register(AvailabilityExceptionModel)
class AvailabilityExceptionAdmin(admin.ModelAdmin):
    """Admin for AvailabilityException model."""

    list_display = [
        "doctor",
        "date",
        "exception_type",
        "start_time",
        "end_time",
        "reason",
    ]
    list_filter = ["exception_type", "date"]
    search_fields = ["doctor__user__phone_number", "reason"]
    readonly_fields = ["created_at", "updated_at"]
    date_hierarchy = "date"

    fieldsets = (
        ("Doctor & Date", {"fields": ("doctor", "date", "exception_type")}),
        (
            "Time & Pricing (for AVAILABLE type)",
            {
                "fields": (
                    "start_time",
                    "end_time",
                    "price_irr",
                    "duration_minutes",
                    "appointment_type",
                )
            },
        ),
        ("Details", {"fields": ("reason",)}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )
