from rest_framework import serializers
from orders.models import Basket, Order, OrderDetails
from menu.models import MenuItem, OptionDetail
from users.models import User

# ✅ Sepet Ürünü Serileştirici
class BasketSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source="item.name", read_only=True)
    item_price = serializers.DecimalField(source="item.price", max_digits=10, decimal_places=2, read_only=True)
    option_details = serializers.SerializerMethodField()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Basket
        fields = ['id', 'user', 'item', 'item_name', 'item_price', 'quantity', 'option_details', 'total_price']

    def get_option_details(self, obj):
        return [{"id": opt.id, "name": opt.option_name, "price": float(opt.price)} for opt in obj.option_details.all()]

    def get_total_price(self, obj):
        base_price = obj.item.price
        options_price = sum(opt.price for opt in obj.option_details.all())
        return (base_price + options_price) * obj.quantity

# ✅ Sipariş Detayları Serileştirici
class OrderDetailsSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)
    options = serializers.SerializerMethodField()

    class Meta:
        model = OrderDetails
        fields = ['id', 'order', 'menu_item', 'menu_item_name', 'quantity', 'price', 'options']

    def get_options(self, obj):
        return [{"id": opt.id, "name": opt.option_name, "price": float(opt.price)} for opt in obj.option_details.all()]

# ✅ Sipariş Serileştirici
class OrderSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    order_details = OrderDetailsSerializer(many=True, read_only=True, source='order_details_set')
    
    class Meta:
        model = Order
        fields = ['id', 'user', 'user_name', 'order_date', 'total_amount', 'order_status', 'order_details']
