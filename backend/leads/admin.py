from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):

    list_display = (
        "contact_name",
        "company",
        "status",
        "origin",
        "email",
    )

    search_fields = (
        "contact_name",
        "email",
        "company__name",
    )

    list_filter = (
        "status",
        "origin",
    )