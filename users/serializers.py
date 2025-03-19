from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

# ✅ Kullanıcı Serileştirici
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'user_type', 'date_joined', 'is_active']
        read_only_fields = ['id', 'date_joined', 'is_active']

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip() or obj.email.split('@')[0]

# ✅ Kullanıcı Kayıt Serileştirici (Şifre Hashleme Dahil)
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name', 'user_type']

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            user_type=validated_data.get('user_type', 'customer')
        )
        return user

# ✅ Kullanıcı Giriş Serileştirici
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

