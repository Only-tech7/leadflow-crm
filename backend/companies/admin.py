from django.contrib import admin
from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "segment",
        "city",
        "state",
        "created_at",
    )

    search_fields = (
        "name",
        "segment",
    )

    list_filter = (
        "state",
        "segment",
    )