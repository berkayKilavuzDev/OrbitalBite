# admin.py

from django.contrib import admin
from .models import Category, Item, Basket, Option, OptionDetail

admin.site.register(Category)
admin.site.register(Item)
#admin.site.register(Basket)
admin.site.register(Option)
admin.site.register(OptionDetail)

class BasketAdmin(admin.ModelAdmin):
    list_display = ['item', 'quantity', 'selected_options', 'user']  # Add the method to list_display
    list_filter = ['user']  # Add a dropdown filter for users

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs  # Superusers see all baskets
        return qs.filter(user=request.user)  # Non-superusers see only their own baskets

    def selected_options(self, obj):
        return obj.get_selected_options()  # Use the method from the model to get the options

    selected_options.short_description = 'Selected Options'  # Optional: Set column name in the admin panel


admin.site.register(Basket, BasketAdmin)
