from django.urls import reverse_lazy
from django.views.generic import CreateView, View
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect

from django.contrib.auth import login
from .forms import CustomUserCreationForm

from django.contrib.auth.decorators import login_required
from .models import Category, Item, Basket, Option

from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

from django.db.models import Sum
from decimal import Decimal
from django.template.loader import render_to_string



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
                item.total_price = item.item.price * item.quantity

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


@csrf_exempt
def add_to_basket(request):
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        quantity = int(request.POST.get('quantity'))
        selected_options = request.POST.get('options')

        try:
            item = Item.objects.get(id=item_id)
            user = request.user
            

            if selected_options:
                option = Option.objects.get(id=selected_options)

                # Create basket item
                basket_item, created = Basket.objects.get_or_create(user=user, item=item, option=option)
                basket_item.quantity += quantity
                basket_item.save()
            
            else:
                # Create basket item
                basket_item, created = Basket.objects.get_or_create(user=user, item=item)
                basket_item.quantity += quantity
                basket_item.save()

            # Add selected options to the basket item
            if selected_options:
                for option_id in selected_options:
                    option = Option.objects.get(id=option_id)
                    basket_item.option = option
                    basket_item.save()
            else:
                basket_item.save()            

            # Get updated basket items
            basket_items = Basket.objects.filter(user=user)
            for item in basket_items:
                item.total_price = item.item.price * item.quantity

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
                item.total_price = item.item.price * item.quantity

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

def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'signup.html', {'form': form})

def home_view(request):
    # Retrieve all categories
    categories = Category.objects.all()
    
    # Retrieve all options
    options = Option.objects.all()

    # Create a dictionary to hold category-item mapping
    category_items = {}
    for category in categories:
        # Retrieve items for each category
        items = Item.objects.filter(category=category)
        category_items[category] = items

    # Initialize basket_items
    basket_items = []
    # Get basket items for the logged-in user
    if request.user.is_authenticated:
        basket_items = Basket.objects.filter(user=request.user)
    
        for item in basket_items:
            item.total_price = item.item.price * item.quantity
    
    checkout_price= sum(item.total_price for item in basket_items)
    checkout_price = round(Decimal(checkout_price), 2) if checkout_price else Decimal('0.00')

    # Pass the categories, category-item mapping, and basket items to the template context
    context = {
        'categories': categories,
        'category_items': category_items,
        'basket_items': basket_items if request.user.is_authenticated else None,
        'options': options,
        'checkout_price': checkout_price
    }

    return render(request, 'home.html', context)

class CustomLoginView(LoginView):
    template_name = 'login.html'  # Specify the template name
    success_url = reverse_lazy('home')  # Redirect URL after successful login

@login_required
def account(request):
    # Logic to fetch user's account information
    user = request.user
    context = {
        'user': user,
        # Add other context variables as needed
    }
    return render(request, 'account.html', context)

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

def get_options(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        options = item.option_set.all()  # Assuming Option model has a ForeignKey to Item
        
        options_data = [{'id': option.id, 'option_name': option.option_name, 'price': option.price} for option in options]
        
        return JsonResponse({
            'status': 'success',
            'options': options_data
        })
    except Item.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Item not found!'}, status=404)
