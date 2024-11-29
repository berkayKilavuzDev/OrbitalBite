from django.contrib import admin
from django.urls import path
from django.urls import include


urlpatterns = [
    path('admin/', admin.site.urls),    
    path('', include('core.urls', namespace='core')), # Include URLs from the 'core' app
    
    path('', include('users.urls', namespace='users')), 
    path('', include('orders.urls', namespace='orders')), 
    path('', include('menu.urls', namespace='menu')),  
]

