from django.contrib import admin
from django.urls import path
from .views import *


urlpatterns = [
    path('cart/', CartView.as_view(), name='receive_data'),
]
