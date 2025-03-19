from django.db import models
from django.contrib.auth.models import User
from menu.models import MenuItem, OptionDetail, SideItem

class Basket(models.Model):
    """ Kullanıcının sepetinde bulunan ürünler """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="baskets")
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    option_details = models.ManyToManyField(OptionDetail, through="BasketOption", blank=True)  # ✅ Ara model
    side_items = models.ManyToManyField(SideItem, through="BasketSideItem", blank=True)  # ✅ Yeni ekleme
    created_at = models.DateTimeField(auto_now=True)
    updated_at = models.DateTimeField(auto_now=True)

    def total_price(self):
        """ Sepet içindeki toplam fiyatı hesaplar """
        base_price = self.item.price
        options_price = sum(option.price for option in self.option_details.all())
        side_price = sum(side.price for side in self.side_items.all())
        return (base_price + options_price + side_price) * self.quantity

    def __str__(self):
        return f"{self.user.username} - {self.item.name} ({self.quantity})"

class BasketOption(models.Model):
    """ Basket ve OptionDetail arasındaki ManyToMany ilişkisini yöneten ara model """
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    option_detail = models.ForeignKey(OptionDetail, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.basket.user.username} - {self.option_detail.optionDetail_name}"

class BasketSideItem(models.Model):
    """ Basket ve SideItem arasındaki ManyToMany ilişkisini yöneten ara model """
    basket = models.ForeignKey(Basket, on_delete=models.CASCADE)
    side_item = models.ForeignKey(SideItem, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.basket.user.username} - {self.side_item.item_name}"

class Order(models.Model):
    """ Kullanıcının verdiği siparişleri yönetir """
    STATUS_CHOICES = [
        ('pending', 'Pending'),  # Müşteri siparişi verdi, henüz onaylanmadı
        ('approved', 'Approved'),  # Restoran siparişi onayladı
        ('preparing', 'Preparing'),  # Hazırlanıyor
        ('delivered', 'Delivered'),  # Sipariş tamamlandı
        ('cancelled', 'Cancelled')  # Sipariş iptal edildi
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    order_date = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    order_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.username} - {self.order_status}"

class OrderDetails(models.Model):
    """ Sipariş içindeki her bir ürün detayını yönetir """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="order_details")
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    option_details = models.ManyToManyField(OptionDetail, blank=True)  # ✅ Güncellendi
    side_items = models.ManyToManyField(SideItem, blank=True)  # ✅ Yeni eklendi
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Order {self.order.id} - {self.menu_item.name}"


