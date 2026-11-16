from django.db import models
from django.conf import settings
from products.models import Product  # Убедитесь, что импорт вашей модели продуктов правильный
from djmoney.models.fields import MoneyField
from payments.models import BasePayment
from payments import PurchasedItem

class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    total_price = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='UAH')

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

# Новая модель для позиций внутри заказа
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    

    def __str__(self):
        return f"{self.quantity} x {self.product.name} (Order {self.order.id})"
class Payment(BasePayment):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    def get_purchased_items(self):
        # Передаем заказ как одну позицию в чек для платежного шлюза
        yield PurchasedItem(
            name=f'Заказ №{self.order.id}',
            sku=str(self.order.id),
            quantity=1,
            price=self.total,
            currency=self.currency,
        )
    def get_success_url(self) -> str:
        return f'http://localhost:5173/payment-success?order_id={self.order.id}'

    def get_failure_url(self) -> str:
        return f'http://localhost:5173/payment-failed?order_id={self.order.id}'