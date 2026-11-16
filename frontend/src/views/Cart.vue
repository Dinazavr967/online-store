<template>
  <v-container class="py-8" max-width="1200">
    <!-- Заголовок в стиле каталога -->
    <h1 class="text-h4 font-weight-bold mb-6">{{ t('cartTitle') }}</h1>

    <v-row v-if="cartItems.length > 0">
      <!-- Список товаров -->
      <v-col cols="12" md="8">
        <v-card 
          v-for="item in cartItems" 
          :key="item.id" 
          outlined 
          class="mb-4 rounded-lg pa-4"
          style="border: 1px solid #e0e0e0; box-shadow: none;"
        >
          <v-row align="center">
            <!-- Изображение товара -->
            <v-col cols="3" sm="2">
              <v-img
                :src="item.image || 'https://placeholder.com'"
                aspect-ratio="1"
                class="rounded-lg grey lighten-4"
              ></v-img>
            </v-col>

            <!-- Информация о товаре -->
            <v-col cols="5" sm="5">
              <div class="text-subtitle-1 font-weight-bold mb-1">{{ item.name }}</div>
              <div class="text-body-2 grey--text mb-2">{{ t(item.descriptionKey) }}</div>
              <div class="text-body-1 font-weight-bold success--text">{{ t('price') }}: {{ totalPrice }} {{ currencySymbol }}</div>
            </v-col>

            <!-- Управление количеством -->
            <v-col cols="4" sm="3" class="d-flex align-center justify-center">
              <v-btn 
                icon 
                small 
                outlined 
                @click="updateQuantity(item.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              >
                <v-icon small>mdi-minus</v-icon>
              </v-btn>
              
              <span class="mx-3 text-subtitle-1 font-weight-bold">{{ item.quantity }}</span>
              
              <v-btn 
                icon 
                small 
                outlined 
                @click="updateQuantity(item.id, item.quantity + 1)"
              >
                <v-icon small>mdi-plus</v-icon>
              </v-btn>
            </v-col>

            <!-- Кнопка удаления -->
            <v-col cols="12" sm="2" class="text-right">
              <v-btn icon color="error" @click="removeItem(item.id)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Блок оформления заказа (Сумма) -->
      <v-col cols="12" md="4">
        <v-card 
          outlined 
          class="pa-6 rounded-lg fill-height d-flex flex-column justify-space-between"
          style="border: 1px solid #e0e0e0; box-shadow: none; background-color: #fafafa;"
        >
          <div>
            <div class="text-h6 font-weight-bold mb-4">{{ t('orderParameters') }}</div>
            <div class="d-flex justify-space-between mb-2">
              <span class="grey--text">{{ t('itemCount') }}:</span>
              <span class="font-weight-medium">{{ totalCount }} {{ t('pieces') }}</span>
            </div>
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-between align-baseline mb-6">
              <span class="text-h6 font-weight-bold">{{ t('total') }}:</span>
              <span class="text-h5 font-weight-bold success--text">{{ totalPrice }} {{ currencySymbol }}</span>
            </div>
          </div>

          <v-btn 
          type="button"  
          color="success" 
            block 
            large 
            class="rounded-lg text-none font-weight-bold"
            elevation="0"
            @click="createOrder()"
          >
            {{ t('placeOrder') }}
          </v-btn>
          <p v-if="backendErrorText" style="color: red;">
      {{ backendErrorText }}
    </p>
        </v-card>
      </v-col>
    </v-row>

    <!-- Пустая корзина -->
    <v-row v-else justify="center" class="py-12">
      <v-col cols="12" sm="6" class="text-center">
        <v-icon size="80" color="grey lighten-1" class="mb-4">mdi-cart-outline</v-icon>
        <div class="text-h5 font-weight-bold mb-2">{{ t('emptyCart') }}</div>
        <p class="grey--text mb-6">{{ t('emptyCartHint') }}</p>
        <v-btn 
          color="success" 
          outlined 
          to="/" 
          class="rounded-lg text-none font-weight-bold"
        >
          {{ t('backToCatalog') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useCartPage, useI18n } from './Main.js';

const {
  cartItems,
  totalCount,
  totalPrice,
  updateQuantity,
  removeItem,
  createOrder,
  backendErrorText,
  currencySymbol,
} = useCartPage();
const { t } = useI18n();
</script>
http://127.0.0.1:8000/api/cart/cart/