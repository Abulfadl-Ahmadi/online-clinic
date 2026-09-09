from django.contrib import admin
from django.utils.html import format_html
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.db import transaction

from accounts.models import UserModel, ProfileModel, SettingsModel
from accounts.constants import UserStatus

from .profile_admin import ProfileInline
from .settings_admin import SettingsInline


@admin.action(description="Soft-delete selected users")
def soft_delete_users(modeladmin, request, queryset):
    for user in queryset:
        user.soft_delete()


@admin.register(UserModel)
class UserAdmin(BaseUserAdmin):
    """FULLY OPTIMIZED admin configuration for UserModel"""

    inlines = [
        ProfileInline,
        SettingsInline,
    ]

    list_per_page = 25
    list_max_show_all = 100

    # All the previous optimization code here...
    list_display = [
        "phone_number",
        "user_role_info",
        "status_formatted",
        "last_login",
        "updated_at",
        "created_at",
    ]

    search_fields = [
        "phone_number",
    ]

    list_filter = [
        "role",
        "status",
        "groups",
        "is_superuser",
    ]

    ordering = ["-created_at"]
    readonly_fields = [
        "id",
        "last_login",
        "created_at",
        "updated_at",
        "deleted_at",
        "is_staff",
        "is_active",
        "is_deleted",
    ]

    actions = [soft_delete_users]

    # Include all other display methods...
    def user_role_info(self, obj):
        role_colors = {"admin": "#127429", "user": "#1762b8", "menu_owner": "#fd7e14"}
        role_color = role_colors.get(obj.role, "#6c757d")
        role_badge = format_html(
            '<span style="background-color:{}; color:white; padding:2px 6px; border-radius:4px; font-size:11px;">{}</span>',
            role_color,
            obj.role,
        )
        super_text = "Superuser" if obj.is_superuser else "Not Superuser"
        super_color = "#127429" if obj.is_superuser else "#6c757d"
        super_badge = format_html(
            '<span style="background-color:{}; color:white; padding:2px 6px; border-radius:4px; font-size:11px;">{}</span>',
            super_color,
            super_text,
        )
        return format_html("{} {}", role_badge, super_badge)

    user_role_info.short_description = "Role"

    def status_formatted(self, obj):
        badge_styles = {
            UserStatus.ACTIVE: "background-color: #127429; color: white; padding: 2px 6px; border-radius: 6px;",
            UserStatus.INACTIVE: "background-color: #6c757d; color: white; padding: 2px 6px; border-radius: 6px;",
            UserStatus.BANNED: "background-color: #dc3545; color: white; padding: 2px 6px; border-radius: 6px;",
            UserStatus.DELETED: "background-color: #fd7e14; color: white; padding: 2px 6px; border-radius: 6px;",
        }
        style = badge_styles.get(
            obj.status,
            "background-color: #343a40; color: white; padding: 2px 6px; border-radius: 6px;",
        )
        return format_html(
            '<span style="{}">{}</span>', style, obj.get_status_display()
        )

    status_formatted.short_description = "Status"

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "role",
                    "status",
                    "phone_number",
                    "password1",
                    "password2",
                ),
            },
        ),
    )

    fieldsets = (
        (
            "Basic Info",
            {
                "fields": (
                    "id",
                    "phone_number",
                    "password",
                )
            },
        ),
        (
            "Role & Status",
            {
                "fields": (
                    "role",
                    "status",
                    "is_superuser",
                    "is_staff",
                    "is_active",
                    "is_deleted",
                )
            },
        ),
        (
            "Important Dates",
            {"fields": ("last_login", "created_at", "updated_at", "deleted_at")},
        ),
        (
            "Permissions",
            {"classes": ("collapse",), "fields": ("groups", "user_permissions")},
        ),
    )

    def save_model(self, request, obj, form, change):
        """Override to handle profile and settings creation safely"""
        with transaction.atomic():
            is_new = obj.pk is None
            super().save_model(request, obj, form, change)
            
            if is_new:
                # Create ProfileModel if it doesn't exist (using get_or_create for safety)
                ProfileModel.objects.get_or_create(user=obj)
                
                # Create SettingsModel if it doesn't exist
                SettingsModel.objects.get_or_create(user=obj)
    
    def save_formset(self, request, form, formset, change):
        """Safely save inline formsets to prevent duplicates"""
        instances = formset.save(commit=False)
        
        for instance in instances:
            # Use get_or_create to prevent duplicates
            if isinstance(instance, ProfileModel):
                ProfileModel.objects.get_or_create(
                    user=instance.user,
                    defaults={
                        'first_name': getattr(instance, 'first_name', ''),
                        'last_name': getattr(instance, 'last_name', ''),
                        'national_code': getattr(instance, 'national_code', None),
                        'gender': getattr(instance, 'gender', None),
                        'birthday': getattr(instance, 'birthday', None),
                        'avatar': getattr(instance, 'avatar', None),
                    }
                )
            elif isinstance(instance, SettingsModel):
                SettingsModel.objects.get_or_create(
                    user=instance.user,
                    defaults={
                        'language': getattr(instance, 'language', 'fa'),
                        'theme': getattr(instance, 'theme', 'light'),
                    }
                )
            else:
                instance.save()
        
        for obj in formset.deleted_objects:
            obj.delete()
        
        formset.save_m2m()
