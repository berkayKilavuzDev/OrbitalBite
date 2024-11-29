from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from menu.models import Item, OptionDetail


class Basket(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1) 
    option = models.ManyToManyField(OptionDetail)
    #menu_item_option = models.ForeignKey(MenuItemOption, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, null=True)
    
    def get_selected_options(self):
        return ", ".join([option.optionDetail_name for option in self.option.all()])
    
    def __str__(self):
        options = ", ".join([option.optionDetail_name for option in self.option.all()])
        if options:
            return f"{self.item.name} ({options}) - {self.quantity}"
        else:
            return f"{self.item.name} - {self.quantity}"
        #return f"{self.item.name} - {self.quantity}"