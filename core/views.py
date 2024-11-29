from django.shortcuts import render
from decimal import Decimal
from orders.models import Basket
from menu.models import Category, Item, Option, OptionDetail
from django.http import JsonResponse
import requests


from django.http import JsonResponse
from django.shortcuts import get_object_or_404

def item_details_api(request, item_id):
    # Fetch the requested item or return 404 if not found
    item = get_object_or_404(Item, id=item_id)

    # Build the response data
    data = {
        'name': item.name,
        'description': item.description,
        'price': float(item.price),
        'options': [
            {
                'id': option.id,
                'name': option.option_name,
                'type': option.option_type,
                'details': [
                    {
                        'id': detail.id,
                        'name': detail.optionDetail_name,
                        'price': float(detail.price or 0),
                    }
                    for detail in option.optiondetail_set.all()
                ],
            }
            for option in item.option_set.all()
        ]
    }

    # Return the data as JSON
    return JsonResponse(data)


def home_view(request):
    # Retrieve all categories and items
    categories = Category.objects.all()
    category_items = {
        category: Item.objects.filter(category=category) for category in categories
    }

    # Basket items logic
    basket_items = []
    checkout_price = Decimal('0.00')
    if request.user.is_authenticated:
        basket_items = Basket.objects.filter(user=request.user)
        for item in basket_items:
            item_price = item.item.price

            # Check if the basket item has selected options
            if item.option.exists():
                option_details = item.option.all()
                for option in option_details:
                    # Add option price to the item's base price if applicable
                    if option.price:
                        item_price += option.price
            
            # Calculate total price for the basket item
            item.total_price = item_price * item.quantity
        
        # Calculate the checkout total price
        checkout_price = sum(item.total_price for item in basket_items)
        checkout_price = round(Decimal(checkout_price), 2)

    # Pass the categories, items, basket items, and options to the template context
    context = {
        'categories': categories,                          # Categories for the sidebar
        'category_items': category_items,                  # Mapping of categories to their items
        'basket_items': basket_items,                      # User's basket items
        'checkout_price': checkout_price,                  # Total checkout price
    }

    return render(request, 'core/home.html', context)



def postcode_suggestions(request):
    if request.method == "GET":
        query = request.GET.get('postcode', '').strip()
        
        if not query:
            return JsonResponse({'error': 'Postcode is required'}, status=400)
        
        # Use Postcodes.io to get detailed postcode information
        api_url = f"http://api.postcodes.io/postcodes?q={query}"
        try:
            response = requests.get(api_url)
            data = response.json()

            if response.status_code == 200 and data['status'] == 200:
                suggestions = []
                for result in data['result']:
                    suggestions.append({
                        'postcode': result['postcode'],
                        'admin_district': result['admin_district'],
                        'region': result['region'],
                        'country': result['country']
                    })

                return JsonResponse(suggestions, safe=False)
            else:
                return JsonResponse({'error': 'No suggestions found'}, status=404)
        except requests.exceptions.RequestException as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=400)