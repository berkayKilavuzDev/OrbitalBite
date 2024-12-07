# urls.py

from django.urls import path
from django.contrib.auth.views import LogoutView
from django.contrib.auth import views as auth_views
from . import views

app_name = 'orders'

urlpatterns = [
    #path('', home_view, name='home'),
    #path('signup/', signup, name='signup'),
    #path('login/', CustomLoginView.as_view(), name='login'),
    #path('logout/', LogoutView.as_view(next_page='home'), name='logout'),  # Logout URL
    #path('account/', account, name='account'),
    path('order-history/', views.order_history, name='order_history'),
    path('order-complete/', views.order_complete, name='order_complete'),
    
    
    #path('password_reset/', auth_views.PasswordResetView.as_view(), name='password_reset'),
    #path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(template_name='registration/password_reset_done.html'), name='password_reset_done'),
    #path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='registration/custom_reset_confirm.html'), name='password_reset_confirm'),
    #path('reset/done/', auth_views.PasswordResetCompleteView.as_view(template_name='registration/custom_reset_complete.html'), name='password_reset_complete'),
    
    #path('cart/add/', views.cart_add, name='cart-add'),
    path('add-to-basket/', views.add_to_basket, name='add_to_basket'),
    path('update-basket/', views.update_basket, name='update_basket'),
    path('delete-from-basket/', views.delete_from_basket, name='delete_from_basket'),
    
    
    
]
