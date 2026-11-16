from django.contrib import admin
from .models import Order, OrderItem
from .models import Payment
from unfold.admin import ModelAdmin, TabularInline

# Чтобы товары отображались прямо внутри страницы заказа в удобном виде таблицы:
class OrderItemInline(TabularInline):
    model = OrderItem
    extra = 0  # Не создавать пустые строки по умолчанию
    readonly_fields = ('product', 'quantity') # Опционально: сделать только для чтения

@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ('id', 'user', 'created_at', 'updated_at') # Колонки в списке заказов
    list_filter = ('created_at', 'user') # Фильтры справа
    inlines = [OrderItemInline] # Подключаем отображение товаров заказа внутри самого заказа

# Опционально: если хотите видеть позиции товаров и как отдельный независимый список:
@admin.register(OrderItem)
class OrderItemAdmin(ModelAdmin):
    list_display = ('id', 'order', 'product', 'quantity')


@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = ('id', 'order', 'status', 'variant', 'total', 'currency', 'created')
    list_filter = ('status', 'variant')