from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = 'core'

urlpatterns = [
    path("api/item-details/<int:item_id>/", views.item_details_api, name="item-details-api"),  # ✅ React için API endpoint
    path("api/postcode-suggestions/", views.postcode_suggestions, name="postcode-suggestions"),  # ✅ Postcode API açıldı
] 

# ✅ Medya dosyalarının sunulması için ekleme (DEBUG modda çalışır)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns = [
    path("api/site-info/", views.site_info, name="site-info"),  # 🆕 Yeni eklenen API
]
