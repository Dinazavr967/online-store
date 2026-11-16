from djmoney.models.fields import MoneyField
from django.db import models

class Product(models.Model):
    # Текстовое поле (для коротких строк) с ограничением в 200 символов
    name = models.CharField(max_length=100, verbose_name="Название товара")
    # Большое текстовое поле (для описания)
    description = models.TextField(verbose_name="Описание")
        
    # Целое число для количества на складе
    quantity = models.PositiveBigIntegerField(default=0, verbose_name="Количество")
    
    #Поля для указания валюты и цены с использованием библиотеки django-money
    price = MoneyField(max_digits=14, decimal_places=2, default=0, default_currency='UAH', verbose_name="Цена")
    
    # Поле даты и времени (автоматически ставит время создания записи)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата добавления")
    

    # Этот метод отвечает за то, как объект будет отображаться текстом (например, в админке)
    def __str__(self):
        return self.name
class ProductImage(models.Model):
    # Связываем картинку с конкретным товаром. 
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name="Товар")
    
    # Поле для загрузки файла (картинки будут сохраняться в папку products_gallery/)
    image = models.ImageField(upload_to='products_gallery/', verbose_name="Изображение")

    def __str__(self):
        return f"Фото для {self.product.name}"