from django.contrib import admin
from .models import Product, ProductImage

# Настройка, чтобы картинки отображались встроенными строками на странице товара
class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 3 # Сколько пустых полей для фото показывать сразу

class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]

admin.site.register(Product, ProductAdmin)
