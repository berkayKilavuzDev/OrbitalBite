from django.test import TestCase
from menu.models import MenuCategory, MenuItem, Option, OptionDetail
from django.contrib.auth import get_user_model

User = get_user_model()


class MenuModelTests(TestCase):

    def setUp(self):
        """Test verilerini oluştur."""
        self.restaurant = User.objects.create_user(username="test_restaurant", password="testpass", user_type="restaurant")
        self.category = MenuCategory.objects.create(name="Pizza")
        self.menu_item = MenuItem.objects.create(
            restaurant=self.restaurant,
            name="Margherita Pizza",
            description="Cheese & Tomato",
            price=9.99,
            category=self.category,
            is_available=True,
        )
        self.option = Option.objects.create(parent_menu_item=self.menu_item, option_name="Extra Cheese", option_type="checkbox")
        self.option_detail = OptionDetail.objects.create(parent_option=self.option, option_name="Double Cheese", price=1.50)

    def test_category_creation(self):
        """Menü kategorisi başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.category.name, "Pizza")

    def test_menu_item_creation(self):
        """Menü öğesi başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.menu_item.name, "Margherita Pizza")
        self.assertEqual(self.menu_item.price, 9.99)

    def test_option_creation(self):
        """Opsiyon (extra seçenekler) başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.option.option_name, "Extra Cheese")

    def test_option_detail_creation(self):
        """Opsiyon detayları (fiyatlandırma) başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.option_detail.option_name, "Double Cheese")
        self.assertEqual(self.option_detail.price, 1.50)


