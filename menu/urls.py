from django.urls import path, include
from django.contrib import admin
from django.views.generic.base import TemplateView
from . import views

app_name = 'users'

urlpatterns = [
    #path('admin/', admin.site.urls),
    #path("", TemplateView.as_view(template_name="home.html"), name="home"),
    
    #TODO: Uncomment after adding views
    # path('sitemap.xml', views.sitemap_view, name='sitemap'),  # Sitemap URL
    # path('privacy/', views.privacy_view, name='privacy')
    path('get-options/<int:item_id>/', views.get_options, name='get_options'),
]