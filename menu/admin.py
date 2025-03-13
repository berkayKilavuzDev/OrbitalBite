from django.contrib import admin
from .models import MenuCategory, MenuItem, Option, OptionDetail

admin.site.register(MenuCategory)
admin.site.register(MenuItem)
admin.site.register(Option)
admin.site.register(OptionDetail)
