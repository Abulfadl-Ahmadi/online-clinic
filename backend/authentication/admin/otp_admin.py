from django.contrib import admin
from authentication.models import OTPModel


@admin.register(OTPModel)
class OTPAdmin(admin.ModelAdmin):
    list_display = [
        "phone_number",
        "type",
        "is_used",
        "attempts",
        "expired",
        "updated_at",
        "created_at",
    ]
    list_filter = [
        "is_used",
    ]
    search_fields = [
        "phone_number",
    ]
    readonly_fields = [
        "phone_number",
        "type",
        "salt",
        "code_hash",
        "is_used",
        "attempts",
        "expired",
        "updated_at",
        "created_at",
    ]
