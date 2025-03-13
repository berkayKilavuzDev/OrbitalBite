from django.db import models
from users.models import User

class MenuCategory(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    photo = models.ImageField(upload_to='menu_photos/', blank=True, null=True)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
    has_option = models.BooleanField(default=False)

    def __str__(self):
        return self.name  # Artık restaurant ismini koymaya gerek yok

class Option(models.Model):
    parent_menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="options")
    option_name = models.CharField(max_length=255)
    option_type = models.CharField(max_length=20, choices=[('checkbox', 'Checkbox'), ('radio', 'Radio')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.parent_menu_item.name} - {self.option_name}'

class OptionDetail(models.Model):
    parent_option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name="option_details")
    option_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f'{self.option_name} - {self.price}'