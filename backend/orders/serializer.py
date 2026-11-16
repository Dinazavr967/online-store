from rest_framework import serializers
from products.models import Product

class OrderItemSerializer(serializers.Serializer):
    id = serializers.IntegerField(source='product_id')
    quantity = serializers.IntegerField()
    stock = serializers.SerializerMethodField() # Метод для этого поля должен называться get_stock

    def change_stock(self, obj):
        # Извлекаем данные из словаря (так как obj - это dict из validated_data)
        product_id = obj.get('product_id')
        quantity = obj.get('quantity', 0)

        if product_id:
            try:
                # Ищем продукт по первичному ключу id
                product = Product.objects.get(id=product_id)
                product.quantity -= quantity  # Уменьшаем остаток на складе
                product.save()                # Сохраняем изменения в БД
            except Product.DoesNotExist:
                pass  # Просто пропускаем, если продукт не найден

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError("Количество товара должно быть больше 0.")
        return value
