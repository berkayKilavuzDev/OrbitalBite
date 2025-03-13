from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),

    # Kullanıcı işlemleri (login, logout, register, profil güncelleme)
    path('users/', include('users.urls')),  

    # Menü işlemleri (ürün listesi, detaylar)
    path('menu/', include('menu.urls')),

    # Sipariş işlemleri (sipariş oluşturma, sipariş geçmişi)
    path('orders/', include('orders.urls')),

    # Ana sayfa ve genel işlemler
    path('', include('core.urls')),  
]
