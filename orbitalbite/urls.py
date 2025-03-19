from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/users/',include('users.urls')),  # 🔹 Kullanıcı API'leri
    path('api/menu/',include('menu.urls')),  # 🔹 Menü API'leri
    path('api/orders/',include('orders.urls')),  # 🔹 Sipariş API'leri
    # Ana sayfa ve genel işlemler
    path('',include('core.urls')),  
]
