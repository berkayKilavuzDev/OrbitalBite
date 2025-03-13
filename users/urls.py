from django.urls import path
from django.contrib.auth import views as auth_views
from .views import CustomPasswordResetView, signup, logout_view, account, update_profile, change_password, login_view

app_name = 'users'

urlpatterns = [
    path('api/signup/', signup, name='signup'),
    path('api/login/', login_view, name='login'),
    path('api/logout/', logout_view, name='logout'),
    path('api/password_reset/', CustomPasswordResetView.as_view(), name='password_reset'),
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(
        template_name='users/password_reset_done.html'), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(
        template_name='users/password_reset_confirm.html',
        success_url='/reset/done/'), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(
        template_name='users/password_reset_complete.html'), name='password_reset_complete'),
    path('api/account/', account, name='account'),
    path('api/update-profile/', update_profile, name='update_profile'),  # 🆕 Kullanıcı Profili Güncelleme
    path('api/change-password/', change_password, name='change_password'),  # 🆕 Şifre Değiştirme
]
