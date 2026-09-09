from django.contrib import admin
from clinic.models import RecurringAvailabilityModel


@admin.register(RecurringAvailabilityModel)
class RecurringAvailabilityAdmin(admin.ModelAdmin):
    """Admin for RecurringAvailability model."""

    list_display = [
        "doctor",
        "get_day_display",
        "start_time",
        "end_time",
        "price_irr",
        "duration_minutes",
        "is_active",
    ]
    list_filter = ["is_active", "day_of_week", "appointment_type"]
    search_fields = ["doctor__user__phone_number", "doctor__medical_license_number"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        (
            "Doctor & Schedule",
            {"fields": ("doctor", "day_of_week", "start_time", "end_time")},
        ),
        (
            "Pricing & Settings",
            {"fields": ("price_irr", "duration_minutes", "appointment_type")},
        ),
        ("Status & Validity", {"fields": ("is_active", "valid_from", "valid_until")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def get_day_display(self, obj):
        return obj.get_day_of_week_display()

    get_day_display.short_description = "Day"
