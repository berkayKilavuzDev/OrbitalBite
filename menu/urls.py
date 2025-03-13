from django.urls import path
from . import views

app_name = 'menu'

urlpatterns = [
    path("api/menu-items/", views.get_menu, name="get-menu"),  # 🆕 Menü API'si eklendi!
    path("api/categories/", views.get_categories, name="categories"),  # 🆕 Kategorileri almak için
    path("api/item-details/<int:item_id>/", views.item_details_api, name="item-details-api"),  
]
