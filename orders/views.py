from django.urls import reverse_lazy
from django.views.generic import CreateView, View
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect

from django.contrib.auth import login
from .forms import CustomUserCreationForm

from django.contrib.auth.decorators import login_required
from menu.models import Category, Item, OptionDetail
from orders.models import Basket

from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

from django.db.models import Sum
from decimal import Decimal
from django.template.loader import render_to_string

from django.db.models import Sum


@csrf_exempt
def delete_from_basket(request):
    if request.method == 'POST':
        item_id = request.POST.get('item_id')

        try:
            user = request.user

            # Delete the item from the user's basket
            basket_item = Basket.objects.get(user=user, id=item_id)
            basket_item.delete()

            # Get updated basket items
            basket_items = Basket.objects.filter(user=user)
            for item in basket_items:
                # Base item price
                item_price = item.item.price
                
                # Check if the item has selected options
                if item.option.exists():
                    # Get all related OptionDetails
                    option_details = item.option.all()
                    
                    for option in option_details:
                        # Check if the OptionDetail has a price
                        if option.price:
                            # If the OptionDetail has a parent_menuItem, add the option price to the item price
                            if option.parent_menuItem:
                                item_price += option.price
                            else:
                                # Replace item price with the option price if there's no parent_menuItem
                                item_price = option.price
                
                # Calculate the total price for the basket item
                item.total_price = item_price * item.quantity

            basket_html = render_to_string('basket_items.html', {'basket_items': basket_items})

            # Calculate checkout_price
            checkout_price = sum(item.total_price for item in basket_items)
            checkout_price = round(Decimal(checkout_price), 2) if checkout_price else Decimal('0.00')

            return JsonResponse({
                'status': 'success',
                'message': 'Item added to basket successfully!',
                'basket_html': basket_html,
                'checkout_price': float(checkout_price)
            })

            return JsonResponse({'status': 'success', 'basket_html': basket_html, 'checkout_price': checkout_price})
        except Basket.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Item not found in the basket'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})



import json
@csrf_exempt
def add_to_basket(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            quantity = int(data.get('quantity', 1))
            option_ids = data.get('options', [])  # List of selected option IDs

            # Fetch the item and user
            item = Item.objects.get(pk=item_id)
            user = request.user

            # Fetch selected options
            option_details = OptionDetail.objects.filter(id__in=option_ids) if option_ids else []

            # Check for existing basket items with the same item and options
            existing_basket_items = Basket.objects.filter(user=user, item=item)

            # Flag for matching basket item
            exact_match_found = False

            for basket_item in existing_basket_items:
                # Check if options match
                basket_item_options = basket_item.option.all()
                if set(basket_item_options) == set(option_details):
                    # Exact match found, update quantity
                    basket_item.quantity += quantity
                    basket_item.save()
                    exact_match_found = True
                    break

            if not exact_match_found:
                # No exact match found, create a new basket item
                new_basket_item = Basket(user=user, item=item, quantity=quantity)
                new_basket_item.save()
                new_basket_item.option.set(option_details)  # Link options
                new_basket_item.save()

            # Calculate updated basket data
            basket_items = Basket.objects.filter(user=user)
            basket_data = []
            checkout_price = Decimal(0.00)

            for basket_item in basket_items:
                # Calculate total price for each item
                item_price = basket_item.item.price
                option_price = basket_item.option.aggregate(total=Sum('price'))['total'] or Decimal(0.00)
                total_price = (item_price + option_price) * basket_item.quantity
                checkout_price += total_price

                # Add item details to response data
                basket_data.append({
                    'id': basket_item.id,
                    'item_name': basket_item.item.name,
                    'quantity': basket_item.quantity,
                    'options': [opt.optionDetail_name for opt in basket_item.option.all()],
                    'total_price': float(total_price),
                })

            # Return updated basket details
            return JsonResponse({
                'status': 'success',
                'basket': basket_data,
                'checkout_price': float(checkout_price),
            })
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request!'}, status=400)












@csrf_exempt
def add_to_basket2(request):
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        quantity = int(request.POST.get('quantity', 1))
        selected_options = request.POST.get('options')  # This is a string like "1,3"

        try:
            item = Item.objects.get(id=item_id)
            user = request.user

            if selected_options:
                # Convert the comma-separated string to a list of integers
                option_ids = [int(opt_id) for opt_id in selected_options.split(',')]

                # Get the corresponding OptionDetail objects
                option_details = OptionDetail.objects.filter(id__in=option_ids)

                # Find all basket items for the user with the same item
                existing_basket_items = Basket.objects.filter(user=user, item=item)

                # Flag to check if an exact match is found
                exact_match_found = False

                for basket_item in existing_basket_items:
                    # Get the options associated with the current basket item
                    basket_item_options = basket_item.option.all()

                    # Check if the options match exactly
                    if set(basket_item_options) == set(option_details):
                        exact_match_found = True
                        existing_basket_item = basket_item
                        break

                if exact_match_found:
                    # If the exact combination exists, update the quantity
                    existing_basket_item.quantity += quantity
                    existing_basket_item.save()
                else:
                    # If no exact match is found, create a new basket item
                    new_basket_item = Basket(user=user, item=item, quantity=quantity)
                    new_basket_item.save()
                    new_basket_item.option.set(option_details)
                    new_basket_item.save()

            else:
                # If no options are selected, handle the base item without options
                basket_item, created = Basket.objects.get_or_create(user=user, item=item)
                if not created:
                    basket_item.quantity += quantity
                basket_item.save()

            # Get updated basket items
            basket_items = Basket.objects.filter(user=user)
            for item in basket_items:
                # Base item price
                item_price = item.item.price
                
                # Get all related OptionDetails
                option_details = item.option.all()
                
                # Calculate the total price of selected options
                total_option_price = option_details.aggregate(total_price=Sum('price'))['total_price'] or Decimal('0.00')
                
                # Add the total option price to the item price
                item_price += total_option_price
                
                # Calculate the total price for the basket item
                item.total_price = item_price * item.quantity

            basket_html = render_to_string('orders/basket_items.html', {'basket_items': basket_items})

            # Calculate checkout price
            checkout_price = sum(item.total_price for item in basket_items)
            checkout_price = round(Decimal(checkout_price), 2) if checkout_price else Decimal('0.00')

            return JsonResponse({
                'status': 'success',
                'message': 'Item(s) added to basket successfully!',
                'basket_html': basket_html,
                'checkout_price': float(checkout_price)
            })
        except Item.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Item not found!'}, status=404)

    return JsonResponse({'status': 'error', 'message': 'Invalid request!'}, status=400)



@csrf_exempt
def update_basket(request):
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        quantity = int(request.POST.get('quantity'))

        try:
            user = request.user

            # Check if the item is already in the user's basket
            basket_item = Basket.objects.get(user=user, id=item_id)            
            basket_item.quantity = quantity           
            basket_item.save()

            # Get updated basket items
            basket_items = Basket.objects.filter(user=user)
            for item in basket_items:
                # Base item price
                item_price = item.item.price
                
                # Check if the item has selected options
                if item.option.exists():
                    # Get all related OptionDetails
                    option_details = item.option.all()
                    
                    for option in option_details:
                        # Check if the OptionDetail has a price
                        if option.price:
                            # If the OptionDetail has a parent_menuItem, add the option price to the item price
                            if option.parent_menuItem:
                                item_price += option.price
                            else:
                                # Replace item price with the option price if there's no parent_menuItem
                                item_price = option.price
                
                # Calculate the total price for the basket item
                item.total_price = item_price * item.quantity

            basket_html = render_to_string('basket_items.html', {'basket_items': basket_items})

            # Calculate checkout_price
            checkout_price = sum(item.total_price for item in basket_items)
            checkout_price = round(Decimal(checkout_price), 2) if checkout_price else Decimal('0.00')

            return JsonResponse({
                'status': 'success',
                'message': 'Item added to basket successfully!',
                'basket_html': basket_html,
                'checkout_price': float(checkout_price)
            })
        except Item.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Item not found!'}, status=404)

    return JsonResponse({'status': 'error', 'message': 'Invalid request!'}, status=400)





@login_required
def order_history(request):
    # Logic to fetch user's account information
    user = request.user
    context = {
        'user': user,
        # Add other context variables as needed
    }
    return render(request, 'order_history.html', context)

from django.http import JsonResponse

@login_required
def order_complete(request):
    # Logic to fetch user's account information
    user = request.user
    context = {
        'user': user,
        # Add other context variables as needed
    }
    return render(request, 'order_complete.html', context)

from django.http import JsonResponse
