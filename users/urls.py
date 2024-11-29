from django.urls import path, include
from django.contrib.auth.views import LogoutView
from django.views.generic.base import TemplateView

from django.contrib.auth import views as auth_views
from .views import CustomPasswordResetView
from . import views

app_name = 'users'

urlpatterns = [
    #path('account/', views.account_view, name='account'),
    
    path('signup/', views.signup, name='signup'),
    path('login/', views.CustomLoginView.as_view(), name='login'),
    path('logout/', views.logout, name='logout'),
    
    path('password_reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='users/password_reset_done.html'),
        name='password_reset_done'
        ),
    path('reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='users/password_reset_confirm.html',
        success_url='/reset/done/'),
        name='password_reset_confirm'
        ),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(
        template_name='users/password_reset_complete.html'),
        name='password_reset_complete'
        ),
]