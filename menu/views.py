from django.shortcuts import render
from menu.models import Item
from django.http import JsonResponse


def get_options(request, item_id):
    try:
        item = Item.objects.get(id=item_id)
        options = item.option_set.all()  # Assuming Option model has a ForeignKey to Item
        
        options_data = []
        
        for option in options:
            option_details = option.optiondetail_set.all()  # Get all OptionDetails associated with this option
            option_details_data = [{'id': detail.id, 'optionDetail_name': detail.optionDetail_name, 'price': detail.price} for detail in option_details]
            
            options_data.append({
                'id': option.id,
                'option_name': option.option_name,
                'details': option_details_data
            })
            
        #options_data = [{'id': option.id, 'option_name': option.option_name, 'price': option.price} for option in options]
        print(options_data)
        
        return JsonResponse({
            'status': 'success',
            'options': options_data
        })
    except Item.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Item not found!'}, status=404)
