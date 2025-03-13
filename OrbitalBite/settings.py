"""
Django settings for orbitalbite project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv

# 🌍 Ortam değişkenlerini yükle
load_dotenv()

# 📁 Proje dizini
BASE_DIR = Path(__file__).resolve().parent.parent

AUTH_USER_MODEL = 'users.User'

# 📌 Site Bilgileri
SITE_NAME = "Hacettepe Kebab"
SITE_URL = "https://hacettepekebab.com"
SUPPORT_EMAIL = "support@hacettepekebab.com"

# 🔑 Güvenlik Ayarları
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-defaultkey")
DEBUG = os.getenv("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

# 🔄 Kullanıcı giriş-çıkış yönlendirmeleri
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'home'

# ✅ **INSTALLED_APPS** (Kullanılan Uygulamalar)
INSTALLED_APPS = [
    # 🟢 Üçüncü Taraf Paketler
    'corsheaders',  # React ile çalışmak için
    'rest_framework',  # API desteği

    # 🏗 Django Uygulamaları
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 🚀 Yerel Uygulamalar
    'core',
    'users',
    'menu',
    'orders',
]

# ✅ **MIDDLEWARE** (Orta Katman İşlemleri)
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS Middleware (React ile uyum için)
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ✅ **URL Ayarları**
ROOT_URLCONF = 'orbitalbite.urls'

# ✅ **TEMPLATES** (Şablon Ayarları)
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'core.context_processors.site_name',  # 🌍 Yeni eklenen site bilgisi
            ],
        },
    },
]

# ✅ **WSGI Konfigürasyonu**
WSGI_APPLICATION = 'orbitalbite.wsgi.application'

# ✅ **Veritabanı Ayarları**
DATABASES = {
    'default': {
        'ENGINE': os.getenv("DB_ENGINE", "django.db.backends.sqlite3"),
        'NAME': os.getenv("DB_NAME", BASE_DIR / "db.sqlite3"),
        'USER': os.getenv("DB_USER", ""),
        'PASSWORD': os.getenv("DB_PASSWORD", ""),
        'HOST': os.getenv("DB_HOST", ""),
        'PORT': os.getenv("DB_PORT", ""),
    }
}

# ✅ **Şifre Doğrulama**
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ✅ **Django Yerelleştirme (Zaman Dilimi ve Dil)**
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ✅ **Statik ve Medya Dosyaları**
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# ✅ **Varsayılan Model ID Alanı**
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ✅ **E-Posta Ayarları**
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
EMAIL_HOST = os.getenv("EMAIL_HOST", "")
EMAIL_PORT = os.getenv("EMAIL_PORT", "587")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True") == "True"
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "")

# ✅ **CORS Ayarları (React için)**
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000").split(",")
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
CORS_ALLOW_HEADERS = ['*']
