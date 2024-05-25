
from django.urls import reverse_lazy
from django.views.generic import CreateView, View
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect

from django.contrib.auth import login
from .forms import CustomUserCreationForm

from django.contrib.auth.decorators import login_required
from .models import Category, Item, Basket

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