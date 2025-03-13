from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
    ('admin', 'Admin'),
    ('employee', 'Employee'),
    ('customer', 'Customer'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='customer')
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='users_groups',  # Django varsayılanından farklı bir isim
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='users_permissions',  # Django varsayılanından farklı bir isim
        blank=True
    )
    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"  