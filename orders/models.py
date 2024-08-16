from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Item(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    isAvailable = models.BooleanField(default=1)
    photo = models.ImageField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    hasOption = models.BooleanField(default=0)    
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class OptionType(models.TextChoices):
    CHECKBOX = 'Checkbox', 'Checkbox'
    RADIO = 'Radio', 'Radio'

class Option(models.Model):
    parent_menu_item = models.ForeignKey(Item, on_delete=models.CASCADE)
    option_name = models.CharField(max_length=255)
    option_type = models.CharField(max_length=20, choices=OptionType.choices,  null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.parent_menu_item.name} - {self.option_name}'
    
class OptionDetail(models.Model):
    parent_option = models.ForeignKey(Option, on_delete=models.CASCADE)
    parent_menuItem = models.ForeignKey(Item, on_delete=models.CASCADE, null=True)
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
        return f'{self.parent_option.parent_menu_item.name} - {self.parent_option.option_name} - {self.optionDetail_name} - {self.price}'


class Basket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1) 
    option = models.ManyToManyField(OptionDetail, null=True)
    #menu_item_option = models.ForeignKey(MenuItemOption, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    def get_selected_options(self):
        return ", ".join([option.optionDetail_name for option in self.option.all()])
    
    def __str__(self):
        options = ", ".join([option.optionDetail_name for option in self.option.all()])
        if options:
            return f"{self.item.name} ({options}) - {self.quantity}"
        else:
            return f"{self.item.name} - {self.quantity}"
        #return f"{self.item.name} - {self.quantity}"