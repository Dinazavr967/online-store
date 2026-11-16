from django.contrib import admin
from django.urls import path, include  # Обязательно импортируем include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Подключаем маршруты приложений
    path('api/products/', include('products.urls'),),
    path('api/accounts/', include('accounts.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
]

# Важно: добавляем раздачу медиа-файлов (картинок товаров) во время разработки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
