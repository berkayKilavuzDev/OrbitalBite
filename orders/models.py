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
    price = models.DecimalField(max_digits=10, decimal_places=2)
    isAvailable = models.BooleanField(default=1)
    photo = models.ImageField(blank=True, null=True)
    hasOption = models.BooleanField(default=0)
    #options = models.CharField(max_length=100, blank=True, null=True) #this needs to be well defined
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class Option(models.Model):
    parent_menu_item = models.ForeignKey(Item, on_delete=models.CASCADE)
    option_name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.parent_menu_item.name} - {self.option_name}'


class Basket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=0)
    option = models.ForeignKey(Option, on_delete=models.CASCADE, null=True, blank=True)
    #menu_item_option = models.ForeignKey(MenuItemOption, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)

    def __str__(self):
        return f"{self.item}({self.option.option_name}) - {self.quantity}"
        #return f'{self.user.first_name}\'s Basket'