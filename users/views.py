from django.shortcuts import render, redirect

from django.urls import reverse_lazy
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from .forms import CustomUserCreationForm

from django.contrib.auth import logout
from django.shortcuts import redirect

from django.http import JsonResponse
from django.views.decorators.http import require_POST

from django.contrib.auth.decorators import login_required

import json
from django.utils import timezone
import os
from django.contrib import messages

@login_required
def account(request):
    # Logic to fetch user's account information
    user = request.user
    context = {
        'user': user,
        # Add other context variables as needed
    }
    return render(request, 'account.html', context)

def privacy_view(request):
    return render(request, 'users/privacy.html')

@login_required
@require_POST
def update_ad_subscription(request):
    data = json.loads(request.body)
    ad_subscription_status = data.get('ad_subscription', False)
    
    # Update the user's ad_subscription field
    request.user.ad_subscription = ad_subscription_status
    request.user.save()
    
    return JsonResponse({'status': 'success', 'ad_subscription': ad_subscription_status})


@login_required
def upload_resume(request):
    if request.method == 'POST' and 'resume' in request.FILES:
        uploaded_pdf = request.FILES['resume']

        # Save the uploaded file to the user's record (replace the existing file)
        user = request.user

        # Check if the user already has an uploaded file and delete it
        if user.uploaded_pdf:
            # Get the path of the existing file and delete it
            if os.path.isfile(user.uploaded_pdf.path):
                os.remove(user.uploaded_pdf.path)

        # Update with the new uploaded file
        user.uploaded_pdf = uploaded_pdf  # This updates the file
        user.doc_upload_date = timezone.now()  # Update the upload date
        user.save()

        return JsonResponse({
            'status': 'success',
            'file_name': user.uploaded_pdf.name,  # Return the updated file name
            'upload_date': user.doc_upload_date.strftime('%d.%m.%Y')
        })

    return JsonResponse({'status': 'error', 'message': 'No file uploaded'}, status=400)


def logout(request):
    logout(request)  # Logs out the user
    return redirect('home')  # Redirect the user to the login page after logging out

class CustomLoginView(LoginView):
    template_name = 'users/login.html'  # Specify the template name
    success_url = reverse_lazy('home')  # Redirect URL after successful login.


def signup(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home')
    else:
        form = CustomUserCreationForm()
    return render(request, 'users/signup.html', {'form': form})


from django.contrib.auth.views import PasswordResetView
from django.urls import reverse_lazy
from .forms import CustomPasswordResetForm

class CustomPasswordResetView(PasswordResetView):
    template_name = 'users/password_reset_form.html'  # your custom template
    success_url = reverse_lazy('users:password_reset_done')
    form_class = CustomPasswordResetForm  # use the custom form (optional)
    #email_template_name = 'users/password_reset_email.html'  # custom email template



from django.contrib.auth.views import PasswordResetConfirmView
from django.contrib.auth.forms import SetPasswordForm

class CustomPasswordResetConfirmView(PasswordResetConfirmView):
    template_name = 'users/password_reset_confirm.html'
    success_url = reverse_lazy('password_reset_complete')  # Use reverse_lazy for correct URL resolution

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ensure the form is passed to the template
        context['form'] = SetPasswordForm(self.request.user)
        return context