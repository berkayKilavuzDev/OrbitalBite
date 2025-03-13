from django.urls import path
from . import views

app_name = 'orders'

urlpatterns = [
    path('api/order-history/', views.order_history, name='order_history'),
    path('api/add-to-basket/', views.add_to_basket, name='add_to_basket'),
    path('api/update-basket/', views.update_basket, name='update_basket'),
    path('api/delete-from-basket/', views.delete_from_basket, name='delete_from_basket'),
    path('api/create-order/', views.create_order, name='create_order'),
    path('api/restaurant-orders/', views.restaurant_orders, name='restaurant_orders'),
    path('api/update-order-status/<int:order_id>/', views.update_order_status, name='update_order_status'),
]
