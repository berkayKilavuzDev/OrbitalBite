
from django.urls import reverse_lazy
from django.views.generic import CreateView, View
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect

from django.contrib.auth import login
from .forms import CustomUserCreationForm

from django.contrib.auth.decorators import login_required

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

class HomeView(View):
    def get(self, request):
        return render(request, 'home.html')

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