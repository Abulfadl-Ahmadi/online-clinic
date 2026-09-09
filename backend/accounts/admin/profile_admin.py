from django.contrib import admin
from accounts.models import ProfileModel
from django.utils.html import format_html


# Inline for UserProfile (editable inside User admin)
class ProfileInline(admin.StackedInline):
    model = ProfileModel
    can_delete = False
    verbose_name_plural = "Profile"
    fk_name = "user"
    readonly_fields = ("created_at", "updated_at")
    fields = (
        "avatar",
        "national_code",
        "first_name",
        "last_name",
        "gender",
        "birthday",
        "created_at",
        "updated_at",
    )
    
    # Prevent duplicate profile creation
    max_num = 1
    min_num = 0
    extra = 0
    
    def has_add_permission(self, request, obj=None):
        """Prevent adding profile if one already exists"""
        if obj and hasattr(obj, 'profile'):
            return False
        return super().has_add_permission(request, obj)


# Standalone admin for UserProfile
@admin.register(ProfileModel)
class ProfileAdmin(admin.ModelAdmin):
    list_display = [
        "user",
        "national_code",
        "full_name",
        "gender",
        "birthday",
        "updated_at",
        "created_at",
        "avatar_preview",  # show avatar in list view
    ]
    list_filter = [
        "gender",
        "birthday",
    ]
    search_fields = [
        "user__phone_number",
        "first_name",
        "last_name",
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
                    "user",
                    "national_code",
                    "first_name",
                    "last_name",
                )
            },
        ),
        (
            "Avatar",
            {
                "fields": ("avatar",),
            },
        ),
        (
            "Additional Info",
            {
                "fields": (
                    "gender",
                    "birthday",
                )
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    def full_name(self, obj):
        return f"{obj.first_name or ''} {obj.last_name or ''}".strip()

    full_name.short_description = "Full Name"

    def avatar_preview(self, obj):
        """Show avatar thumbnail in list_display (non-clickable)."""
        if obj.avatar:
            return format_html(
                '<img src="{}" style="height:30px;width:30px;border-radius:50%;" />',
                obj.avatar.url,
            )
        return "-"

    avatar_preview.short_description = "Avatar"
