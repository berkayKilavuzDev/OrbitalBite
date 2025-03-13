from rest_framework import serializers
from .models import MenuCategory, MenuItem, Option, OptionDetail

# ✅ Menü Kategorisi Serileştirici
class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = '__all__'

# ✅ Seçenek Detayı Serileştirici (Opsiyonların fiyat ve isim bilgileri)
class OptionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionDetail
        fields = '__all__'

# ✅ Seçenekler Serileştirici
class OptionSerializer(serializers.ModelSerializer):
    option_details = OptionDetailSerializer(many=True, read_only=True, source='option_details_set')

    class Meta:
        model = Option
        fields = ['id', 'option_name', 'option_type', 'option_details']

# ✅ Menü Ürünü Serileştirici
class MenuItemSerializer(serializers.ModelSerializer):
    category = MenuCategorySerializer(read_only=True)
    options = OptionSerializer(many=True, read_only=True, source='options')
    restaurant_name = serializers.CharField(source='restaurant.username', read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'restaurant', 'restaurant_name', 'name', 'description', 'price', 'is_available', 'photo', 'category', 'has_option', 'options']
