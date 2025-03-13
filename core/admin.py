from django.contrib import admin
from .models import UserProfile, MenuCategory, MenuItem, Option, OptionDetail, Basket, Order, OrderDetails

# Modelleri admin paneline ekleyelim
admin.site.register(UserProfile)
admin.site.register(MenuCategory)
admin.site.register(MenuItem)
admin.site.register(Option)
admin.site.register(OptionDetail)
admin.site.register(Basket)
admin.site.register(Order)
admin.site.register(OrderDetails)
