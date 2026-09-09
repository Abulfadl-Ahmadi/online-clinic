from django.contrib import admin
from accounts.models import DoctorProfileModel


@admin.register(DoctorProfileModel)
class DoctorProfileAdmin(admin.ModelAdmin):
    """Admin for Doctor Profile model."""

    list_display = [
        "full_name",
        "phone_number",
        "medical_license_number",
        "is_verified",
        "is_accepting_patients",
        "updated_at",
        "created_at",
    ]
    list_filter = ["is_verified", "is_accepting_patients", "created_at"]
    search_fields = [
        "user__phone_number",
        "medical_license_number",
        "user__profile__first_name",
        "user__profile__last_name",
    ]
    filter_horizontal = ["specializations"]
    readonly_fields = ["created_at", "updated_at"]

    fieldsets = (
        ("User Information", {"fields": ("user", "medical_license_number")}),
        (
            "Professional Details",
            {"fields": ("specializations", "bio", "years_of_experience")},
        ),
        (
            "Consultation Settings",
            {"fields": ("default_consultation_duration", "default_price_irr")},
        ),
        ("Status", {"fields": ("is_accepting_patients", "is_verified")}),
        (
            "Timestamps",
            {"fields": ("created_at", "updated_at"), "classes": ("collapse",)},
        ),
    )

    def phone_number(self, obj):
        return obj.user.phone_number

    phone_number.short_description = "Phone"

    actions = ["verify_doctors", "unverify_doctors"]

    def verify_doctors(self, request, queryset):
        """Verify selected doctors."""
        updated = queryset.update(is_verified=True)
        self.message_user(request, f"{updated} doctors verified successfully.")

    verify_doctors.short_description = "Verify selected doctors"

    def unverify_doctors(self, request, queryset):
        """Unverify selected doctors."""
        updated = queryset.update(is_verified=False)
        self.message_user(request, f"{updated} doctors unverified.")

    unverify_doctors.short_description = "Unverify selected doctors"
