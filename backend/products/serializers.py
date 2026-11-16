from rest_framework import serializers
from djmoney.contrib.django_rest_framework import MoneyField # <-- ОБЯЗАТЕЛЬНЫЙ ИМПОРТ
from .models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    
    # Явно указываем DRF, как обрабатывать поле денег:
    price = MoneyField(max_digits=14, decimal_places=2) 

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'quantity', 'price', 'created_at', 'images']
