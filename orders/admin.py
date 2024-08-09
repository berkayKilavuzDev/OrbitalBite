# admin.py

from django.contrib import admin
from .models import Category, Item, Basket, Option

admin.site.register(Category)
admin.site.register(Item)
admin.site.register(Basket)
admin.site.register(Option)

