from django.contrib import admin
from .models import Basket, Order


class BasketAdmin(admin.ModelAdmin):
    list_display = ['item', 'quantity', 'selected_options', 'user']
    list_filter = ['user']

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user=request.user)

    def selected_options(self, obj):
        return obj.get_selected_options()

    selected_options.short_description = 'Selected Options'


class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_amount', 'order_status', 'order_date']
    list_filter = ['order_status', 'order_date']
    search_fields = ['user__username', 'id']
    ordering = ['-order_date']


admin.site.register(Basket, BasketAdmin)
admin.site.register(Order, OrderAdmin)
