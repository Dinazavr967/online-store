from .serializers import ProductSerializer
from .models import Product
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def Product_list(request):
    if request.method == 'GET':
        Products = Product.objects.all()
        serializer = ProductSerializer(Products, many=True, context={'request': request})
        return Response(serializer.data)
  # Обязательно добавьте этот декоратор!
@api_view(['GET'])
def Product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product, context={'request': request})
    
    return Response(serializer.data)

