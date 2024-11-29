from django.urls import path, include
from django.contrib import admin
from django.views.generic.base import TemplateView
from . import views 
from django.conf import settings
from django.conf.urls.static import static

app_name = 'core'

urlpatterns = [
    path('', views.home_view, name="home"),
    #path("", TemplateView.as_view(template_name="core/home.html"), name="home"),
    
    #TODO: Uncomment after adding views
    #path('sitemap.xml', views.sitemap_view, name='sitemap'),  # Sitemap URL
    # path('privacy/', views.privacy_view, name='privacy')
    #path('postcode-suggestions/', views.postcode_suggestions, name='postcode_suggestions'),  # Correct URL pattern
    path('api/item-details/<int:item_id>/', views.item_details_api, name='item-details-api'),
    
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)