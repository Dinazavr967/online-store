from decimal import Decimal
from django.dispatch import receiver
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from djmoney.money import Money
from payments import PaymentStatus, RedirectNeeded
from payments.signals import status_changed
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import F
from products.models import Product
from .models import Order, OrderItem, Payment
from .serializer import OrderItemSerializer
from django.db import IntegrityError, transaction


class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = OrderItemSerializer
    queryset = Order.objects.all()

# Внутри метода create:
    def create(self, request, *args, **kwargs):
        cart_data = request.data
        if isinstance(cart_data, dict):
            items_list = cart_data.get('items') or cart_data.get('cartItems') or cart_data.get('products')
            if items_list is None:
                return Response(
                    {"error": "Неверная структура данных корзины. Ожидался список элементов."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        else:
            items_list = cart_data

        if not items_list:
            return Response({"error": "Корзина пуста."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Группируем товары по числовому ID (чтобы '5' и 5 объединялись вместе)
        grouped_quantities = {}
        for item in items_list:
            if isinstance(item, str):
                return Response(
                    {"error": f"Элемент корзины передан как строка: {item}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            raw_id = item.get('product_id') or item.get('id') or item.get('product')
            if raw_id is None:
                return Response(
                    {"error": "В одном из элементов корзины отсутствует ID товара"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                product_id = int(raw_id)
                quantity = int(item.get('quantity', 1))
            except (ValueError, TypeError):
                return Response(
                    {"error": "Некорректный ID или количество товара"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if quantity < 1:
                return Response(
                    {"error": "Количество товара должно быть больше нуля"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            grouped_quantities[product_id] = grouped_quantities.get(product_id, 0) + quantity

        # 2. Проверяем наличие и оформляем заказ в единой транзакции
        try:
            with transaction.atomic():
                total_price = 0
                validated_items = []

                for product_id, quantity in grouped_quantities.items():
                    try:
                        product = Product.objects.select_for_update().get(id=product_id)
                    except Product.DoesNotExist:
                        return Response(
                            {"error": f"Товар с ID {product_id} не найден"},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # Проверка наличия на складе ДО списания
                    if product.quantity < quantity:
                        product_title = getattr(product, 'name', None) or getattr(product, 'title', f'ID {product.id}')
                        return Response(
                            {"error": f"Недостаточно товара «{product_title}» на складе. Доступно: {product.quantity} шт."},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    total_price += product.price * quantity
                    validated_items.append((product, quantity))

                order = Order.objects.create(
                    user=request.user,
                    total_price=Money(total_price.amount, 'UAH')
                )

                order_items = []
                for product, quantity in validated_items:
                    order_items.append(
                        OrderItem(
                            order=order,
                            product=product,
                            quantity=quantity,
                        )
                    )
                    Product.objects.filter(id=product.id).update(
                        quantity=F('quantity') - quantity
                    )

                OrderItem.objects.bulk_create(order_items)

                payment = Payment.objects.create(
                    variant='default',
                    order=order,
                    description=f'Оплата заказа №{order.id}',
                    total=Decimal(order.total_price.amount),
                    currency=order.total_price.currency.code,
                    tax=Decimal('0.00'),
                    delivery=Decimal('0.00'),
                    customer_ip_address=request.META.get('REMOTE_ADDR'),
                    billing_email=order.user.email,
                )

        except IntegrityError:
            return Response(
                {"error": "Недостаточно товара на складе для оформления заказа."},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_url = request.build_absolute_uri(
            reverse('payment_details', kwargs={'payment_id': payment.id})
        )
        return Response({'payment_url': payment_url}, status=status.HTTP_201_CREATED)


def payment_details(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id)
    try:
        form = payment.get_form(data=request.POST or None)
    except RedirectNeeded as redirect_to:
        return redirect(str(redirect_to))

    return render(request, 'payments/payment.html', {'form': form, 'payment': payment})


@receiver(status_changed)
def handle_payment_status_change(sender, instance, **kwargs):
    if instance.status == PaymentStatus.CONFIRMED:
        order = instance.order
        # Убедитесь, что у модели Order есть поле is_paid (если его нет — закомментируйте следующие 2 строки)
        if hasattr(order, 'is_paid'):
            order.is_paid = True
            order.save()
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.urls import reverse
from .models import Order

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    orders = (
        Order.objects.filter(user=request.user)
        .prefetch_related('payments')
        .order_by('-id')
    )

    data = []
    for order in orders:
        # Ищем последний платеж, чтобы дать кнопку «Оплатить», если заказ не оплачен
        last_payment = order.payments.order_by('-id').first()
        payment_url = None
        if not getattr(order, 'is_paid', False) and last_payment:
            payment_url = request.build_absolute_uri(
                reverse('payment_details', kwargs={'payment_id': last_payment.id})
            )

        # Получаем позиции заказа (поддерживает оба варианта related_name: items или orderitem_set)
        order_items = order.items.all() if hasattr(order, 'items') else order.orderitem_set.all()

        data.append({
            'id': order.id,
            'total_price': float(order.total_price.amount),
            'currency': order.total_price.currency.code,
            'is_paid': getattr(order, 'is_paid', False),
            'created_at': order.created_at.strftime('%d.%m.%Y %H:%M') if hasattr(order, 'created_at') else '',
            'payment_url': payment_url,
            'items': [
                {
                    'id': item.id,
                    'product_name': item.product.name,
                    'quantity': item.quantity,
                    'price': float(item.product.price.amount),
                }
                for item in order_items
            ],
        })
    return Response(data)
    
