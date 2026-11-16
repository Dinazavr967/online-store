from django.db import models
from django.conf import settings # Импортируем глобальные настройки

class item_in_cart(models.Model):
    # Django сам поймет, к какой модели привязать ForeignKey
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='cart_items'
    )
    product_id = models.IntegerField()
    quantity = models.IntegerField()

    class Meta:
        # Защита от дубликатов: один и тот же товар у одного юзера — только в одной строке
        unique_together = ('user', 'product_id')