from django import forms
from orders.models import Order
from django.contrib.auth.forms import UserCreationForm
from users.models import User  # Güncellenmiş User modelini kullanıyoruz

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User  # Güncellenmiş User modeli kullanılacak
        fields = ('username', 'email', 'password1', 'password2')

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({'class': 'form-control'})
        self.fields['email'].widget.attrs.update({'class': 'form-control'})
        self.fields['password1'].widget.attrs.update({'class': 'form-control'})
        self.fields['password2'].widget.attrs.update({'class': 'form-control'})

# ✅ Sipariş oluşturma formu eklendi
class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['user', 'total_amount', 'order_status']
        widgets = {
            'user': forms.Select(attrs={'class': 'form-control'}),
            'total_amount': forms.NumberInput(attrs={'class': 'form-control'}),
            'order_status': forms.Select(attrs={'class': 'form-control'}),
        }

