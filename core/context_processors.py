# core/context_processors.py

from django.conf import settings

def site_name(request):
    return {'SITE_NAME': settings.SITE_NAME}

def site_globals(request):
    """
    Genel site bilgilerini şablonlara ve API'lere dahil eder.
    """
    return {
        "SITE_NAME": settings.SITE_NAME,
        "SITE_URL": settings.SITE_URL,
        "SUPPORT_EMAIL": settings.SUPPORT_EMAIL
    }