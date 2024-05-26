from django.urls import reverse_lazy
from django.views.generic import CreateView, View
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect

from django.contrib.auth import login
from .forms import CustomUserCreationForm

from django.contrib.auth.decorators import login_required
from .models import Category, Item, Basket

from django.http import JsonResponse

@login_required
def add_to_basket(request):
    if request.method == 'POST':
        item_id = request.POST.get('item_id')
        quantity = int(request.POST.get('quantity', 1))

        if not item_id or not quantity:
            return JsonResponse({'error': 'Item ID and quantity are required.'}, status=400)

        try:
            item = Item.objects.get(id=item_id)
            basket_item, created = Basket.objects.get_or_create(
                user=request.user,
                item=item,
                defaults={'quantity': quantity}
            )

            if not created:
                basket_item.quantity += quantity
                basket_item.save()

            basket_items = Basket.objects.filter(user=request.user)
            basket = {
                'items': [
                    {
                        'id': b.item.id,
                        'name': b.item.name,
                        'quantity': b.quantity,
                        'price': b.item.price,
                    } for b in basket_items
                ]
            }

            return JsonResponse({'success': 'Item added to basket successfully.', 'basket': basket})
        except Item.DoesNotExist:
            return JsonResponse({'error': 'Item does not exist.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=405)

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

    # Create a dictionary to hold category-item mapping
    category_items = {}
    for category in categories:
        # Retrieve items for each category
        items = Item.objects.filter(category=category)
        category_items[category] = items

    # Get basket items for the logged-in user
    if request.user.is_authenticated:
        basket_items = Basket.objects.filter(user=request.user)

    # Pass the categories, category-item mapping, and basket items to the template context
    context = {
        'categories': categories,
        'category_items': category_items,
        'basket_items': basket_items if request.user.is_authenticated else None
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
