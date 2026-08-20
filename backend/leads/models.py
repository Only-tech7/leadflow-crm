from django.db import models
from companies.models import Company
import uuid


class Lead(models.Model):

    STATUS_CHOICES = [
        ("novo", "Novo"),
        ("contatado", "Contatado"),
        ("respondeu", "Respondeu"),
        ("reuniao", "Reunião"),
        ("proposta", "Proposta"),
        ("ganho", "Ganho"),
        ("perdido", "Perdido"),
    ]

    ORIGIN_CHOICES = [
        ("linkedin", "LinkedIn"),
        ("apollo", "Apollo"),
        ("site", "Site"),
        ("manual", "Manual"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name="leads"
    )

    contact_name = models.CharField(max_length=200)

    position = models.CharField(
        max_length=150,
        blank=True
    )

    email = models.EmailField()

    phone = models.CharField(
        max_length=30,
        blank=True
    )

    linkedin = models.URLField(
        blank=True
    )

    origin = models.CharField(
        max_length=20,
        choices=ORIGIN_CHOICES,
        default="manual"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="novo"
    )

    notes = models.TextField(blank=True)

    next_followup = models.DateField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.contact_name