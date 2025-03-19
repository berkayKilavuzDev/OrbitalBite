from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse_lazy
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.views import PasswordResetView, PasswordResetConfirmView
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils import timezone
from django.contrib import messages
import json
import os

from django.contrib.auth import get_user_model
from .forms import CustomUserCreationForm, CustomPasswordResetForm
from django.contrib.auth.forms import SetPasswordForm

User = get_user_model()

# ✅ Kullanıcı Hesabı Bilgilerini Getirme
@login_required
def account(request):
    """
    Kullanıcı kendi hesap bilgilerini görüntüleyebilir.
    """
    user_data = {
        'id': request.user.id,
        'username': request.user.username,
        'email': request.user.email,
        'role': request.user.role,  # Admin, Çalışan, Müşteri gibi roller
        'phone_number': request.user.phone_number,
        'address': request.user.address,
    }

    return JsonResponse({'status': 'success', 'user': user_data})


# ✅ Kullanıcı Profilini Güncelleme
@csrf_exempt
@login_required
def update_profile(request):
    """
    Kullanıcı profilini güncelleyebilir.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user

            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)
            user.phone_number = data.get('phone_number', user.phone_number)
            user.address = data.get('address', user.address)
            user.save()

            return JsonResponse({'status': 'success', 'message': 'Profile updated successfully!'})
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# ✅ Kullanıcı Kaydı (Signup)
@csrf_exempt
def signup(request):
    """
    Yeni kullanıcı oluşturma işlemi.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')
            role = data.get('role', 'customer')  # Varsayılan olarak müşteri

            if not username or not email or not password:
                return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

            user = CustomUser.objects.create_user(username=username, email=email, password=password, role=role)
            login(request, user)

            return JsonResponse({'status': 'success', 'message': 'User created successfully!', 'user_id': user.id})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# ✅ Kullanıcı Girişi (Login)
@csrf_exempt
def login_view(request):
    """
    Kullanıcı giriş işlemi için API.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')

            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)
                return JsonResponse({'status': 'success', 'message': 'Login successful', 'user_id': user.id, 'role': user.role})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid credentials'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# ✅ Kullanıcı Çıkışı (Logout)
@login_required
def logout_view(request):
    """
    Kullanıcıyı çıkış yaptırır.
    """
    logout(request)
    return JsonResponse({'status': 'success', 'message': 'Logout successful'})


# ✅ Kullanıcı Şifre Sıfırlama
class CustomPasswordResetView(PasswordResetView):
    """
    Şifre sıfırlama işlemi için özel sınıf.
    """
    template_name = 'users/password_reset_form.html'
    success_url = reverse_lazy('users:password_reset_done')
    form_class = CustomPasswordResetForm


# ✅ Kullanıcı Şifre Yenileme
class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    """
    Kullanıcının yeni şifre belirlemesi için sınıf.
    """
    template_name = 'users/password_reset_confirm.html'
    success_url = reverse_lazy('password_reset_complete')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = SetPasswordForm(self.request.user)
        return context
        
@csrf_exempt
@login_required
def update_profile(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user

            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.email = data.get('email', user.email)
            user.phone_number = data.get('phone_number', user.phone_number)
            user.address = data.get('address', user.address)
            user.save()

            return JsonResponse({'status': 'success', 'message': 'Profile updated successfully!'})
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
    # ✅ Kullanıcı Şifre Değiştirme (Eksik API'yi ekliyoruz)
    
@csrf_exempt
@login_required
def change_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user = request.user
            current_password = data.get('current_password')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')

            # Mevcut şifre doğru mu kontrol et
            if not user.check_password(current_password):
                return JsonResponse({'status': 'error', 'message': 'Current password is incorrect'}, status=400)

            # Yeni şifreler eşleşiyor mu?
            if new_password != confirm_password:
                return JsonResponse({'status': 'error', 'message': 'New passwords do not match'}, status=400)

            # Yeni şifreyi ayarla ve kaydet
            user.set_password(new_password)
            user.save()

            return JsonResponse({'status': 'success', 'message': 'Password changed successfully!'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)
