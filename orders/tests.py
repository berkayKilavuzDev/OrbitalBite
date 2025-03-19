from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from orders.models import Basket, Order, OrderDetails
from menu.models import MenuItem, OptionDetail, MenuCategory

User = get_user_model()

class BasketModelTest(TestCase):
    def setUp(self):
        """Test verilerini oluştur."""
        self.user = User.objects.create_user(username="test_user", password="testpass")
        self.category = MenuCategory.objects.create(name="Burger")
        self.menu_item = MenuItem.objects.create(
            restaurant=self.user,
            name="Cheeseburger",
            price=Decimal("5.99"),
            category=self.category,
            is_available=True,
        )
        self.option_detail = OptionDetail.objects.create(parent_option=None, option_name="Extra Cheese", price=Decimal("1.00"))
        self.basket = Basket.objects.create(user=self.user, item=self.menu_item, quantity=2)
        self.basket.option_details.add(self.option_detail)

    def test_basket_creation(self):
        """Sepet başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.basket.user.username, "test_user")
        self.assertEqual(self.basket.item.name, "Cheeseburger")
        self.assertEqual(self.basket.quantity, 2)
        self.assertIn(self.option_detail, self.basket.option_details.all())

    def test_basket_total_price(self):
        """Sepetin toplam fiyatı doğru hesaplanıyor mu?"""
        expected_price = (self.menu_item.price + self.option_detail.price) * self.basket.quantity
        self.assertEqual(self.basket.total_price(), expected_price)


class OrderModelTest(TestCase):
    def setUp(self):
        """Test verilerini oluştur."""
        self.user = User.objects.create_user(username="test_user", password="testpass")
        self.order = Order.objects.create(user=self.user, total_amount=Decimal("15.99"))

    def test_order_creation(self):
        """Sipariş başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.order.user.username, "test_user")
        self.assertEqual(self.order.total_amount, Decimal("15.99"))
        self.assertEqual(self.order.order_status, "pending")


class OrderDetailsModelTest(TestCase):
    def setUp(self):
        """Test verilerini oluştur."""
        self.user = User.objects.create_user(username="test_user", password="testpass")
        self.category = MenuCategory.objects.create(name="Pizza")
        self.menu_item = MenuItem.objects.create(
            restaurant=self.user,
            name="Pepperoni Pizza",
            price=Decimal("12.99"),
            category=self.category,
            is_available=True,
        )
        self.order = Order.objects.create(user=self.user, total_amount=Decimal("25.98"))
        self.order_details = OrderDetails.objects.create(
            order=self.order, menu_item=self.menu_item, quantity=2, price=self.menu_item.price * 2
        )

    def test_order_details_creation(self):
        """Sipariş detayları başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.order_details.order, self.order)
        self.assertEqual(self.order_details.menu_item.name, "Pepperoni Pizza")
        self.assertEqual(self.order_details.quantity, 2)
        self.assertEqual(self.order_details.price, Decimal("25.98"))
