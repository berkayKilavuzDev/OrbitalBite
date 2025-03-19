from django.urls import path
from .views import (
    get_menu, get_categories, get_options, get_side_selections,
    add_menu_item, edit_menu_item, delete_menu_item
)

app_name = "menu"

urlpatterns = [
    path("menu-items/", get_menu, name="get-menu"),  # ✅ Menü öğelerini getir
    path("categories/", get_categories, name="get-categories"),  # ✅ Kategorileri getir
    path("menu-options/item/<int:item_id>/", get_options, name="get-options"),  # ✅ Menü öğesine bağlı seçenekleri getir
    #path("option-details/item/<int:item_id>/", get_option_details, name="get-option-details"),  # ✅ Menü öğesine bağlı seçenek detaylarını getir
    path("side-selections/item/<int:item_id>/", get_side_selections, name="get-side-selections"),  # ✅ Menü öğesine bağlı yan ürünleri getir
    path("add-menu-item/", add_menu_item, name="add-menu-item"),  # ✅ Menüye yeni ürün ekleme
    path("edit-menu-item/<int:item_id>/", edit_menu_item, name="edit-menu-item"),  # ✅ Menü öğesi düzenleme
    path("delete-menu-item/<int:item_id>/", delete_menu_item, name="delete-menu-item"),  # ✅ Menü öğesi silme
]
