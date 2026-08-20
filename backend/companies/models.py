from django.db import models
import uuid


class Company(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255)
    segment = models.CharField(max_length=150, blank=True)
    website = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)

    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=2, blank=True)

    notes = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Empresa"
        verbose_name_plural = "Empresas"
        ordering = ["name"]

    def __str__(self):
        return self.name