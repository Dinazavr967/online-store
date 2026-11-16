from django.contrib import admin
from django.urls import path, include
from .views import OrderViewSet, payment_details, my_orders


urlpatterns = [
    path('create/', OrderViewSet.as_view({'post':'create'}), name='create_order'),  # URL для создания заказа
    path('payment/<int:payment_id>/', payment_details, name='payment_details'),
    path('payments/', include('payments.urls')),
    path('my/', my_orders, name='my_orders'),
]
