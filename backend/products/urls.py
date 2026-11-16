from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
   path('catalog/', Product_list, name='product-list'),
   path('catalog/<int:pk>/', Product_detail, name='product-detail')
]

