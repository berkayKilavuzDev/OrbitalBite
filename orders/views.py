from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.timezone import now
from decimal import Decimal
import json

from menu.models import MenuItem, OptionDetail
from orders.models import Basket, Order, OrderDetails
from django.contrib.auth import get_user_model

User = get_user_model()

# ✅ Sepete Ürün Ekleme (REST API)
@csrf_exempt
@login_required
def add_to_basket(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            quantity = int(data.get('quantity', 1))
            option_ids = data.get('options', [])  

            item = MenuItem.objects.get(pk=item_id)
            user = request.user

            # Seçenekleri getir
            option_details = OptionDetail.objects.filter(id__in=option_ids) if option_ids else []

            # Sepette var mı kontrol et
            existing_basket_item = Basket.objects.filter(user=user, item=item).first()

            if existing_basket_item:
                existing_basket_item.quantity += quantity
                existing_basket_item.save()
            else:
                new_basket_item = Basket.objects.create(user=user, item=item, quantity=quantity)
                new_basket_item.option_details.set(option_details)

            return update_basket_response(user)

        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)

    return JsonResponse({'status': 'error', 'message': 'Invalid request!'}, status=400)


# ✅ Sepetten Ürün Silme
@login_required
def delete_from_basket(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            user = request.user
            basket_item = Basket.objects.get(user=user, id=item_id)
            basket_item.delete()

            return update_basket_response(user)

        except Basket.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Item not found in the basket'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})


# ✅ Sepet Güncelleme
@login_required
def update_basket(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            quantity = int(data.get('quantity'))
            user = request.user

            basket_item = Basket.objects.get(user=user, id=item_id)
            basket_item.quantity = quantity
            basket_item.save()

            return update_basket_response(user)

        except Basket.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Item not found!'}, status=404)

    return JsonResponse({'status': 'error', 'message': 'Invalid request!'}, status=400)


# ✅ Sepet Durumunu Dönen Yardımcı Fonksiyon
def update_basket_response(user):
    basket_items = Basket.objects.filter(user=user)
    checkout_price = Decimal(0.00)

    basket_data = []
    for item in basket_items:
        item_price = item.item.price
        options_price = sum(option.price for option in item.option_details.all())
        total_price = (item_price + options_price) * item.quantity
        checkout_price += total_price

        basket_data.append({
            'id': item.id,
            'item_name': item.item.name,
            'quantity': item.quantity,
            'options': [option.option_name for option in item.option_details.all()],
            'total_price': float(total_price)
        })

    return JsonResponse({
        'status': 'success',
        'basket': basket_data,
        'checkout_price': float(checkout_price)
    })


# ✅ Sipariş Oluşturma (Teslimat bilgileriyle birlikte)
@login_required
def create_order(request):
    user = request.user
    basket_items = Basket.objects.filter(user=user)

    if not basket_items.exists():
        return JsonResponse({'status': 'error', 'message': 'Your basket is empty!'}, status=400)

    data = json.loads(request.body)
    delivery_address = data.get('delivery_address', user.address)
    delivery_time = data.get('delivery_time', None)
    payment_method = data.get('payment_method', 'cash')
    order_notes = data.get('order_notes', '')

    total_price = sum(item.total_price() for item in basket_items)
    
    new_order = Order.objects.create(
        user=user,
        total_amount=total_price,
        order_status='pending',
        delivery_address=delivery_address,
        delivery_time=delivery_time,
        payment_method=payment_method,
        order_notes=order_notes
    )

    for item in basket_items:
        OrderDetails.objects.create(
            order=new_order,
            menu_item=item.item,
            quantity=item.quantity,
            price=item.total_price()
        )

    basket_items.delete()

    return JsonResponse({'status': 'success', 'message': 'Order created successfully!', 'order_id': new_order.id})


# ✅ Sipariş Geçmişi (Ürün seçenekleriyle birlikte)
@login_required
def order_history(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-order_date')

    order_data = [
        {
            'id': order.id,
            'total_amount': float(order.total_amount),
            'status': order.order_status,
            'date': order.order_date.strftime('%d %B %Y %H:%M'),
            'items': [
                {
                    'name': detail.menu_item.name,
                    'quantity': detail.quantity,
                    'price': float(detail.price),
                    'options': [option.option_name for option in detail.menu_item.option_details.all()]
                } for detail in order.order_details.all()
            ]
        } for order in orders
    ]

    return JsonResponse({'orders': order_data})


# ✅ Sipariş Güncelleme (Yetkilendirme güncellendi)
@login_required
def update_order_status(request, order_id):
    if not request.user.is_staff:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)

    try:
        order = Order.objects.get(id=order_id)
        data = json.loads(request.body)
        new_status = data.get('status')

        if new_status in ['approved', 'preparing', 'completed', 'cancelled']:
            order.order_status = new_status
            order.save()

        return JsonResponse({'status': 'success', 'message': 'Order updated successfully!'})

    except Order.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Order not found!'}, status=404)

@login_required
def restaurant_orders(request):
    if request.user.role not in ['admin', 'employee']:
        return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)

    orders = Order.objects.filter(order_status='pending').order_by('-order_date')

    order_data = [
        {
            'id': order.id,
            'customer': order.user.username,
            'total_amount': float(order.total_amount),
            'status': order.order_status,
            'date': order.order_date.strftime('%Y-%m-%d %H:%M:%S'),
        } for order in orders
    ]

    return JsonResponse({'orders': order_data})