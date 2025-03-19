from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import MenuItem, Option, MenuCategory
from .serializers import MenuItemSerializer, MenuCategorySerializer, OptionSerializer

# ✅ Menü listesini getirir (Tüm kullanıcılara açık)
@api_view(['GET'])
def get_menu(request):
    items = MenuItem.objects.filter(is_available=True)
    serializer = MenuItemSerializer(items, many=True)
    return Response({'status': 'success', 'menu': serializer.data})

# ✅ Menüdeki kategorileri getir (Frontend için filtreleme)
@api_view(['GET'])
def get_categories(request):
    categories = MenuCategory.objects.all()
    serializer = MenuCategorySerializer(categories, many=True)
    return Response({'status': 'success', 'categories': serializer.data})

# ✅ Belirtilen menü öğesinin opsiyonlarını getir
@api_view(['GET'])
def get_options(request, item_id):
    item = get_object_or_404(MenuItem, id=item_id)

    # 🔥 Hem kategoriye ait olan hem de sadece bu ürüne özel olan seçenekleri döndür
    category_options = item.category.options.all()  # ✅ `category` içinden `options` çekiyoruz
    item_options = item.item_options.all()  # ✅ Doğrudan `MenuItem` üzerindeki opsiyonları çekiyoruz

    category_serializer = OptionSerializer(category_options, many=True)
    item_serializer = OptionSerializer(item_options, many=True)

    return Response({
        'status': 'success',
        'category_options': category_serializer.data,
        'item_options': item_serializer.data
    })

    
# ✅ Menüye yeni ürün ekleme (Sadece admin yetkisi olan kullanıcılar)
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_menu_item(request):
    serializer = MenuItemSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Menu item added!', 'item': serializer.data})
    return Response({'status': 'error', 'message': serializer.errors}, status=400)

# ✅ Menü öğesini düzenleme (Sadece admin yetkisi olanlar)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def edit_menu_item(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id)
    serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Menu item updated!', 'item': serializer.data})
    return Response({'status': 'error', 'message': serializer.errors}, status=400)

# ✅ Menüden ürün silme (Sadece admin)
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_menu_item(request, item_id):
    menu_item = get_object_or_404(MenuItem, id=item_id)
    menu_item.delete()
    return Response({'status': 'success', 'message': 'Menu item deleted!'})

# ✅ Side Seçeneklerini getir (Yan ürünler, içecekler vs.)
@api_view(['GET'])
def get_side_selections(request, item_id):
    item = get_object_or_404(MenuItem, id=item_id)

    # 🔥 Menü öğesine bağlı side selectionları getir
    side_selections = SideSelection.objects.filter(parent_menu_item=item)
    serializer = SideSelectionSerializer(side_selections, many=True)

    return Response({'status': 'success', 'side_selections': serializer.data})