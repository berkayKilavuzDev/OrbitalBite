from rest_framework import serializers
from .models import MenuCategory, MenuItem, Option, OptionDetail

class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuCategory
        fields = '__all__'

class OptionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OptionDetail
        fields = ['id', 'optionDetail_name', 'price']  # 🔥 `is_default` kaldırıldı çünkü modelde yok

class OptionSerializer(serializers.ModelSerializer):
    option_details = OptionDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Option
        fields = ['id', 'option_name', 'option_type', 'option_details']

class MenuItemSerializer(serializers.ModelSerializer):
    category = serializers.StringRelatedField()  # ✅ Kategoriyi ismiyle çağırıyoruz
    item_options = OptionSerializer(many=True, read_only=True)  # ✅ Ürüne bağlı opsiyonlar
    category_options = OptionSerializer(many=True, read_only=True, source="category.options")  # ✅ Kategorinin opsiyonları

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'is_available', 'photo', 'category', 'item_options', 'category_options']
