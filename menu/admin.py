from django.contrib import admin
from .models import MenuCategory, MenuItem, Option, OptionDetail

class OptionAdmin(admin.ModelAdmin):
    list_display = ('option_name', 'category', 'parent_menu_item')
    list_filter = ('category',)
    search_fields = ('option_name',)
    exclude = ('parent_menu_item',)  # Bu satır, parent_menu_item alanını zorunlu olmaktan çıkarır

admin.site.register(MenuCategory)
admin.site.register(MenuItem)
admin.site.register(Option, OptionAdmin)
admin.site.register(OptionDetail)
