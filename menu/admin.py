from django.contrib import admin
from .models import Category, Item, Option, OptionDetail

admin.site.register(Category)
admin.site.register(Item)
admin.site.register(Option)
admin.site.register(OptionDetail)
