from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from decimal import Decimal
import requests

from menu.models import MenuCategory, MenuItem, Option, OptionDetail
from orders.models import Basket


# ✅ Menü Öğesi Detay API'si
def item_details_api(request, item_id):
    item = get_object_or_404(MenuItem, id=item_id)

    data = {
        'id': item.id,
        'name': item.name,
        'description': item.description or '',
        'price': float(item.price),
        'isAvailable': item.is_available,
        'photo_url': item.photo.url if item.photo else None,
        'options': []
    }

    if item.hasOption:
        options = item.options.all()
        for option in options:
            option_data = {
                'id': option.id,
                'name': option.option_name,
                'type': option.option_type,
                'details': []
            }
            option_details = option.optiondetail_set.all()
            for detail in option_details:
                detail_data = {
                    'id': detail.id,
                    'name': detail.optionDetail_name,
                    'price': float(detail.price or 0),
                }
                option_data['details'].append(detail_data)

            data['options'].append(option_data)

    return JsonResponse(data)


# ✅ Ana Sayfa Görüntüleme
def home_view(request):
    categories = MenuCategory.objects.all()
    category_items = {
        category: MenuItem.objects.filter(category=category) for category in categories
    }

    basket_items = []
    checkout_price = Decimal('0.00')

    if request.user.is_authenticated:
        basket_items = Basket.objects.filter(user=request.user)
        for item in basket_items:
            item_price = item.item.price

            if item.option_details.exists():
                for option in item.option_details.all():
                    if option.price:
                        item_price += option.price

            item.total_price = item_price * item.quantity

        checkout_price = sum(item.total_price for item in basket_items)
        checkout_price = round(Decimal(checkout_price), 2)

    context = {
        'categories': categories,
        'category_items': category_items,
        'basket_items': basket_items,
        'checkout_price': checkout_price,
    }

    return render(request, 'core/home.html', context)


# ✅ Postcode Önerileri API
def postcode_suggestions(request):
    if request.method == "GET":
        query = request.GET.get('postcode', '').strip()

        if not query:
            return JsonResponse({'error': 'Postcode is required'}, status=400)

        api_url = f"http://api.postcodes.io/postcodes?q={query}"
        try:
            response = requests.get(api_url)
            data = response.json()

            if response.status_code == 200 and data['status'] == 200:
                suggestions = []
                for result in data['result']:
                    suggestions.append({
                        'postcode': result['postcode'],
                        'admin_district': result['admin_district'],
                        'region': result['region'],
                        'country': result['country']
                    })

                return JsonResponse(suggestions, safe=False)
            else:
                return JsonResponse({'error': 'No suggestions found'}, status=404)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)
