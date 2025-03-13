from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
import json

from menu.models import MenuItem, Option, OptionDetail, MenuCategory


# ✅ Belirtilen menü öğesinin opsiyonlarını getirir
def get_options(request, item_id):
    try:
        item = MenuItem.objects.get(id=item_id)
        options = Option.objects.filter(parent_menu_item=item)

        options_data = [
            {
                'id': option.id,
                'option_name': option.option_name,
                'option_type': option.option_type,
                'details': [
                    {'id': detail.id, 'option_name': detail.option_name, 'price': float(detail.price)}
                    for detail in option.option_details.all()
                ]
            }
            for option in options
        ]

        return JsonResponse({'status': 'success', 'options': options_data})

    except MenuItem.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Item not found!'}, status=404)


# ✅ Menü listesini getirir (Tüm müşterilere açık)
def get_menu(request):
    items = MenuItem.objects.filter(is_available=True)

    menu_data = [
        {
            'id': item.id,
            'name': item.name,
            'description': item.description,
            'price': float(item.price),
            'photo': item.photo.url if item.photo else None,
            'category': item.category.name if item.category else None,
            'has_option': item.has_option
        }
        for item in items
    ]

    return JsonResponse({'status': 'success', 'menu': menu_data})


# ✅ Menüdeki kategorileri getir (Frontend'de filtreleme için)
def get_categories(request):
    categories = MenuCategory.objects.all()
    category_data = [{'id': cat.id, 'name': cat.name} for cat in categories]

    return JsonResponse({'status': 'success', 'categories': category_data})


# ✅ Menüye yeni ürün ekleme (Sadece admin yetkisi olan kullanıcılar)
@csrf_exempt
@login_required
def add_menu_item(request):
    if not request.user.is_staff:  # Sadece admin veya çalışan ekleyebilir
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            description = data.get('description', '')
            price = data.get('price')
            category_id = data.get('category_id')
            has_option = data.get('has_option', False)

            category = get_object_or_404(Category, id=category_id)

            if not name or not price:
                return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

            new_item = MenuItem.objects.create(
                name=name,
                description=description,
                price=price,
                category=category,
                has_option=has_option
            )

            return JsonResponse({
                'status': 'success',
                'message': 'Menu item added!',
                'item_id': new_item.id
            })

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# ✅ Menü öğesini düzenleme (Sadece admin yetkisi olanlar düzenleyebilir)
@csrf_exempt
@login_required
def edit_menu_item(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id)

    if not request.user.is_staff:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            menu_item.name = data.get('name', menu_item.name)
            menu_item.description = data.get('description', menu_item.description)
            menu_item.price = data.get('price', menu_item.price)
            menu_item.is_available = data.get('is_available', menu_item.is_available)
            menu_item.has_option = data.get('has_option', menu_item.has_option)

            menu_item.save()

            return JsonResponse({'status': 'success', 'message': 'Menu item updated!'})

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request'}, status=400)


# ✅ Menüden ürün silme (Sadece admin silebilir)
@csrf_exempt
@login_required
def delete_menu_item(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id)

    if not request.user.is_staff:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)

    menu_item.delete()
    return JsonResponse({'status': 'success', 'message': 'Menu item deleted!'})
