from django.db import models
from django.contrib.auth import get_user_model  

User = get_user_model() 

# ✅ Kullanıcı Profili
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

# ✅ Menü Kategorileri
class MenuCategory(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

# ✅ Menü Öğeleri
class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    is_deleted = models.BooleanField(default=False)  # ✅ Soft delete özelliği eklendi
    photo = models.ImageField(upload_to="menu_photos/", blank=True, null=True)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
    has_option = models.BooleanField(default=False)

    def __str__(self):
        return self.name

# ✅ Menü Seçenekleri (Ekstra Seçimler)
class Option(models.Model):
    parent_menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="options")
    option_name = models.CharField(max_length=255)
    option_type = models.CharField(max_length=20, choices=[("checkbox", "Checkbox"), ("radio", "Radio")])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.parent_menu_item.name} - {self.option_name}"

# ✅ Seçeneklerin Detayları (Ekstra İçerikler)
class OptionDetail(models.Model):
    parent_option = models.ForeignKey(Option, on_delete=models.CASCADE, related_name="option_details")
    option_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.option_name} - {self.price}"

# ✅ Sepet Modeli
class Basket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="core_basket")
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    option_details = models.ManyToManyField(OptionDetail, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def total_price(self):
        base_price = self.item.price
        options_price = sum(option.price for option in self.option_details.all()) if self.option_details.exists() else 0
        return (base_price + options_price) * self.quantity

    def __str__(self):
        return f"{self.user.username} - {self.item.name} ({self.quantity})"

# ✅ Sipariş Modeli
class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("preparing", "Preparing"),
        ("completed", "Completed"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    is_deleted = models.BooleanField(default=False)  # ✅ Soft delete ekledik

    def __str__(self):
        return f"Order {self.id} - {self.user.username} - {self.order_status}"

# ✅ Sipariş İçeriği Modeli
class OrderDetails(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_details")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    option_details = models.ManyToManyField(OptionDetail, blank=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.order.id} - {self.menu_item.name}"
