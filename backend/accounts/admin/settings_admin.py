from django.contrib import admin
from accounts.models import SettingsModel


class SettingsInline(admin.StackedInline):
    model = SettingsModel
    can_delete = False
    verbose_name_plural = "Settings"
    fk_name = "user"
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Appearance", {"fields": ("theme", "language")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    
    # Prevent duplicate settings creation
    max_num = 1
    min_num = 0
    extra = 0
    
    def has_add_permission(self, request, obj=None):
        """Prevent adding settings if one already exists"""
        if obj and hasattr(obj, 'settings'):
            return False
        return super().has_add_permission(request, obj)

    def get_queryset(self, request):
        """Don't fetch the settings separately - use select_related from parent"""
        return super().get_queryset(request).select_related("user")


@admin.register(SettingsModel)
class SettingsAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "theme",
        "language",
        "updated_at",
        "created_at",
    ]
    list_filter = [
        "theme",
        "language",
    ]
    search_fields = [
        "user__phone_number",
    ]
    readonly_fields = [
        "id",
        "created_at",
        "updated_at",
    ]
    ordering = [
        "-created_at",
    ]

    fieldsets = (
        (
            "Basic Info",
            {
                "fields": (
                    "id",
                    "user",
                )
            },
        ),
        (
            "Appearance",
            {
                "fields": (
                    "theme",
                    "language",
                )
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "updated_at",
                    "created_at",
                )
            },
        ),
    )
