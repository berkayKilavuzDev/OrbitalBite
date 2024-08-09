# orders/tests.py

from decimal import Decimal
from django.test import TestCase
from orders.models import Category, Item

class CategoryModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name='Test Category')

    def test_category_creation(self):
        self.assertTrue(isinstance(self.category, Category))
        self.assertEqual(self.category.__str__(), self.category.name)

    def test_category_fields(self):
        self.assertEqual(self.category.name, 'Test Category')

class ItemModelTest(TestCase):

    def setUp(self):
        self.category = Category.objects.create(name='Test Category')
        self.item = Item.objects.create(
            name='Test Item',
            price=Decimal('9.99'),
            stock=100,
            description='A test item',
            category=self.category
        )

    def test_item_creation(self):
        self.assertTrue(isinstance(self.item, Item))
        self.assertEqual(self.item.__str__(), self.item.name)

    def test_item_fields(self):
        self.assertEqual(self.item.name, 'Test Item')
        self.assertEqual(self.item.price, Decimal('9.99'))
        self.assertEqual(self.item.stock, 100)
        self.assertEqual(self.item.description, 'A test item')
        self.assertEqual(self.item.category, self.category)
