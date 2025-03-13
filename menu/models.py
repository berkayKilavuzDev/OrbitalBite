from django.db import models
from users.models import User

class MenuCategory(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name

class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    photo = models.ImageField(upload_to='menu_photos/', blank=True, null=True)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
    hasOption = models.BooleanField(default=0)   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name  # Artık restaurant ismini koymaya gerek yok

class OptionType(models.TextChoices):
    CHECKBOX = 'checkbox', 'checkbox'
    RADIO = 'radio', 'radio'

class Option(models.Model):
    parent_menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="options")
    option_name = models.CharField(max_length=255)
    option_type = models.CharField(max_length=20, choices=OptionType.choices)   
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.parent_menu_item.name} - {self.option_name}'

class OptionDetail(models.Model):
    parent_option = models.ForeignKey(Option, on_delete=models.CASCADE)
    parent_menuItem = models.ForeignKey(MenuItem, on_delete=models.CASCADE, null=True, blank=True)
    optionDetail_name = models.CharField(max_length=255, null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                help_text="If Parent menuItem selected, leave this area blank!")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Check if a parent_menuItem is selected
        if self.parent_menuItem:
            # Update optionDetail_name and price based on the selected parent_menuItem
            self.optionDetail_name = self.parent_menuItem.name  # Assuming the Item model has a 'name' field
            self.price = self.parent_menuItem.price  # Assuming the Item model has a 'price' field

        super(OptionDetail, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.parent_option.parent_menu_item.name} - {self.parent_option.option_name} - {self.optionDetail_name} - {self.pri
        ce}'
