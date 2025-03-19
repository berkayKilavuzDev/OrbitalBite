from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib.auth import authenticate

User = get_user_model()

class UserModelTest(TestCase):
    def setUp(self):
        """Test için kullanıcı oluştur."""
        self.user = User.objects.create_user(username="test_user", email="test@example.com", password="testpass")
        self.admin = User.objects.create_superuser(username="admin", email="admin@example.com", password="adminpass")

    def test_user_creation(self):
        """Kullanıcı başarıyla oluşturuluyor mu?"""
        self.assertEqual(self.user.username, "test_user")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertTrue(self.user.check_password("testpass"))
        self.assertFalse(self.user.is_staff)  # Normal kullanıcı yönetici olamaz

    def test_admin_creation(self):
        """Admin başarıyla oluşturuluyor mu?"""
        self.assertTrue(self.admin.is_superuser)
        self.assertTrue(self.admin.is_staff)


class UserAuthenticationTest(TestCase):
    def setUp(self):
        """Test için kullanıcı oluştur."""
        self.user = User.objects.create_user(username="test_user", password="testpass")

    def test_login_valid_user(self):
        """Doğru kimlik bilgileriyle giriş yapılıyor mu?"""
        user = authenticate(username="test_user", password="testpass")
        self.assertIsNotNone(user)
        self.assertEqual(user.username, "test_user")

    def test_login_invalid_password(self):
        """Yanlış şifreyle giriş başarısız olmalı."""
        user = authenticate(username="test_user", password="wrongpass")
        self.assertIsNone(user)


class UserViewsTest(TestCase):
    def setUp(self):
        """Test için kullanıcı oluştur ve giriş yap."""
        self.user = User.objects.create_user(username="test_user", password="testpass")
        self.client.login(username="test_user", password="testpass")

    def test_account_page(self):
        """Hesap sayfası yükleniyor mu?"""
        response = self.client.get(reverse("account"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "test_user")  # Sayfada kullanıcı adı olmalı

    def test_logout(self):
        """Çıkış işlemi başarılı mı?"""
        response = self.client.get(reverse("logout"))
        self.assertEqual(response.status_code, 302)  # Redirect olmalı


class UserPasswordChangeTest(TestCase):
    def setUp(self):
        """Test için kullanıcı oluştur."""
        self.user = User.objects.create_user(username="test_user", password="oldpassword")

    def test_password_change(self):
        """Kullanıcı şifresini değiştirebiliyor mu?"""
        self.user.set_password("newpassword")
        self.user.save()
        user = authenticate(username="test_user", password="newpassword")
        self.assertIsNotNone(user)  # Yeni şifreyle giriş yapılabilmeli
