from django.db import models
from django.contrib.auth import get_user_model
from menu.models import MenuItem, OptionDetail

User = get_user_model()

class Basket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="baskets")
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    option_details = models.ManyToManyField(OptionDetail, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_price(self):
        base_price = self.item.price
        options_price = sum(option.price for option in self.option_details.all())
        return (base_price + options_price) * self.quantity

    def __str__(self):
        return f"{self.user.username} - {self.item.name} ({self.quantity})"

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),  # Müşteri siparişi verdi, henüz onaylanmadı
        ('approved', 'Approved'),  # Restoran siparişi onayladı
        ('preparing', 'Preparing'),  # Hazırlanıyor
        ('completed', 'Completed'),  # Sipariş tamamlandı
        ('cancelled', 'Cancelled')  # Sipariş iptal edildi
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="approved_orders"
    )  # Siparişi onaylayan restoran çalışanı

    def __str__(self):
        return f"Order {self.id} - {self.user.username} - {self.order_status}"

class OrderDetails(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_details")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    option_details = models.ManyToManyField(OptionDetail, blank=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.order.id} - {self.menu_item.name}"
