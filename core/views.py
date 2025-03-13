from django.shortcuts import render, get_object_or_404
from decimal import Decimal
from orders.models import Basket
from menu.models import MenuCategory, MenuItem, Option, OptionDetail
from django.http import JsonResponse
from django.conf import settings
import requests
from django.contrib.auth import get_user_model

User = get_user_model()

# ✅ Ürün detaylarını API olarak döndürür
def item_details_api(request, item_id):
    item = get_object_or_404(MenuItem, id=item_id)

    data = {
        'id': item.id,
        'name': item.name,
        'description': item.description or '',
        'price': float(item.price),  
        'is_available': item.is_available,  # Güncellendi
        'photo_url': item.photo.url if item.photo else None,
        'options': []
    }

    # Eğer ürün opsiyon içeriyorsa
    if item.has_option:  # Güncellendi
        options = item.option_set.all()
        for option in options:
            option_data = {
                'id': option.id,
                'name': option.option_name,
                'type': option.option_type,
                'details': []
            }
            option_details = option.optiondetail_set.all()
            for detail in option_details:
                option_data['details'].append({
                    'id': detail.id,
                    'name': detail.option_name,  # Güncellendi
                    'price': float(detail.price or 0),
                })
            data['options'].append(option_data)

    return JsonResponse(data)


# ✅ Ana sayfa görünümü (Menü ve Sepet)
def home_view(request):
    categories = MenuCategory.objects.all()
    category_items = {
        category: MenuItem.objects.filter(category=category) for category in categories
    }

    # Sepet bilgilerini çek
    basket_items = []
    checkout_price = Decimal('0.00')

    if request.user.is_authenticated:
        basket_items = Basket.objects.filter(user=request.user)
        for item in basket_items:
            item_price = item.item.price

            # Seçili opsiyonları kontrol et
            if item.option_details.exists():  # Güncellendi
                for option in item.option_details.all():
                    if option.price:
                        item_price += option.price
            
            item.total_price = item_price * item.quantity

        # Sepet toplam fiyatı
        checkout_price = sum(item.total_price for item in basket_items)
        checkout_price = round(Decimal(checkout_price), 2)

    context = {
        'categories': categories,
        'category_items': category_items,
        'basket_items': basket_items,
        'checkout_price': checkout_price,
    }

    return render(request, 'core/home.html', context)


# ✅ Postcode API Entegrasyonu
def postcode_suggestions(request):
    if request.method == "GET":
        query = request.GET.get('postcode', '').strip()
        
        if not query:
            return JsonResponse({'error': 'Postcode is required'}, status=400)
        
        api_url = f"http://api.postcodes.io/postcodes?q={query}"
        try:
            response = requests.get(api_url)
            data = response.json()

            if response.status_code == 200 and data.get('status') == 200:
                suggestions = [
                    {
                        'postcode': result['postcode'],
                        'admin_district': result.get('admin_district', ''),
                        'region': result.get('region', ''),
                        'country': result.get('country', '')
                    }
                    for result in data.get('result', [])
                ]

                return JsonResponse({'status': 'success', 'suggestions': suggestions})
            else:
                return JsonResponse({'status': 'error', 'message': 'No suggestions found'}, status=404)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)


def site_info(request):
    """
    Site bilgilerini JSON formatında döndürür.
    React frontend bu API’den bilgileri alabilir.
    """
    return JsonResponse({
        "site_name": settings.SITE_NAME,
        "site_url": settings.SITE_URL,
        "support_email": settings.SUPPORT_EMAIL
    })