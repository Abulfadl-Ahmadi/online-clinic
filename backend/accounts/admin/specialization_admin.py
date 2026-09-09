from django.contrib import admin
from accounts.models import SpecializationModel


@admin.register(SpecializationModel)
class SpecializationAdmin(admin.ModelAdmin):
    """Admin for Specialization model."""

    list_display = ["name", "created_at"]
    search_fields = ["name", "description"]
    ordering = ["name"]
