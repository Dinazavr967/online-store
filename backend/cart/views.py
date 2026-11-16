from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import item_in_cart
from .serializer import CartItemSerializer

class CartView(APIView):
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        user_cart_items = item_in_cart.objects.filter(user=request.user)
        serializer = CartItemSerializer(user_cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        cart_data = request.data
        serializer = CartItemSerializer(data=cart_data, many=True)
        
        if serializer.is_valid():
            items_data = serializer.validated_data
            
            # 1. Сохраняем/обновляем товары в БД
            for item in items_data:
                p_id = item.get('product_id') or item.get('id')
                qnt = item.get('quantity')
                
                item_in_cart.objects.update_or_create(
                    user=request.user,          
                    product_id=p_id,
                    defaults={'quantity': qnt}
                )
            
            # 2. Достаем актуальный список всех товаров ЭТОГО пользователя из БД
            user_cart_items = item_in_cart.objects.filter(user=request.user)
            
            # 3. Передаем их в сериализатор для превращения в JSON
            # (так как мы настроили source='product_id', он автоматически вернет ключи как 'id')
            response_serializer = CartItemSerializer(user_cart_items, many=True)
                
            # 4. Возвращаем JSON-массив обратно во Vue
            return Response(response_serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
