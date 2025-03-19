from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

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
        return self.name  

class OptionType(models.TextChoices):
    CHECKBOX = 'checkbox', 'Checkbox'
    RADIO = 'radio', 'Radio'

class Option(models.Model):
    """ Opsiyonlar artık kategoriye bağlı, ayrıca isteğe bağlı olarak spesifik bir MenuItem'a da bağlanabilir. """
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE, null=True, blank=True, related_name="options")
    parent_menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, null=True, blank=True, related_name="item_options")
    option_name = models.CharField(max_length=255)
    option_type = models.CharField(max_length=20, choices=OptionType.choices)     
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        category_name = self.category.name if self.category else "No Category"
        return f"{self.option_name} ({category_name})"


class OptionDetail(models.Model):
    """ Seçenek detayları belirli bir Option grubuna bağlı olmalı. """
    parent_option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name="option_details")
    optionDetail_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.parent_option.option_name} - {self.optionDetail_name} (+£{self.price})"

# ✅ Side Seçenekleri (Örneğin Menüyle Patates ve İçecek Seçimi)
class SideSelection(models.Model):
    parent_menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="side_selections")
    selection_name = models.CharField(max_length=255)  # Örn: "Choose Your Side", "Select Your Drink"

    def __str__(self):
        return f'{self.parent_menu_item.name} - {self.selection_name}'

# ✅ Side Seçenekleri İçin Ürünler
class SideItem(models.Model):
    parent_selection = models.ForeignKey(SideSelection, on_delete=models.CASCADE, related_name="side_items")
    item_name = models.CharField(max_length=255)  # Örn: "Fries", "Coca Cola", "Salad"
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def __str__(self):
        return f'{self.parent_selection.selection_name} - {self.item_name} - £{self.price}'
