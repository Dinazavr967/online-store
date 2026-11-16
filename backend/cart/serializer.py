from rest_framework import serializers
from products.models import Product
class CartItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='product_id')
    quantity = serializers.IntegerField()
    # Добавляем новое поле, которое будет считывать остаток со склада из связанного продукта
    stock = serializers.SerializerMethodField()

    def get_stock(self, obj):
        
        try:
            # Ищем продукт по product_id и забираем его количество на складе
            product = Product.objects.get(id=obj.product_id)
            return product.quantity
        except Product.DoesNotExist:
            return 0
