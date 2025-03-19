from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User




class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'is_staff', 'is_active', 'role')
    list_filter = ('is_staff', 'is_active', 'role')
    search_fields = ('username', 'email')
    ordering = ('-date_joined',)


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'address', 'created_at')
    search_fields = ('user__username', 'phone_number')
    ordering = ('-created_at',)

