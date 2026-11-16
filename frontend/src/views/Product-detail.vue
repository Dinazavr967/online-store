<template>
  <div v-if="product" class="product-detail-container">
    <div class="product-detail-layout">
      
      <!-- Левая колонка: Карусель изображений -->
      <div class="product-media-col">
        <div v-if="product.images && product.images.length" class="carousel-wrapper">
          <v-carousel
            hide-delimiters
            :show-arrows="product.images.length > 1"
            height="450"
          >
            <v-carousel-item
              v-for="imgObj in product.images"
              :key="imgObj.id"
              :src="imgObj.image"
              alt="Product gallery image"
              cover
            ></v-carousel-item>
          </v-carousel>
        </div>
        <div v-else class="no-image-detail">
          {{ t('noImages') }}
        </div>
      </div>

      <!-- Правая колонка: Информация и покупка -->
      <div class="product-info-col">
        <h1 class="product-detail-title">{{ product.name }}</h1>
        
        <div class="product-price-section">
          <span class="price-value">{{ product.price }} {{ currencySymbol }}</span>
        </div>

        <div class="stock-status" :class="{ 'out-of-stock': product.quantity === 0 }">
          <v-icon size="small" class="mr-1">
            {{ product.quantity > 0 ? 'mdi-check-circle-outline' : 'mdi-alert-circle-outline' }}
          </v-icon>
          <span>
            {{ product.quantity > 0 ? t('inStock', { count: product.quantity }) : t('outOfStock') }}
          </span>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="product-description-section">
          <h3>{{ t('productDescription') }}</h3>
          <p class="description-text">{{ product.description }}</p>
        </div>

        <v-btn
          color="primary"
          size="large"
          class="mt-6 buy-button"
          :disabled="product.quantity === 0"
          prepend-icon="mdi-cart-outline"
          elevation="2"
          @click="add_to_cart"
        >
          {{ t('addToCart') }}
        </v-btn>
        <v-btn
          color="secondary"
          size="large"
          class="mt-4 view-cart-button"
          prepend-icon="mdi-cart-arrow-right"
          elevation="2"
          @click="postCart"></v-btn>
      </div>

    </div>
  </div>
  
  <div v-else class="loading-container">
    <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    <p class="mt-4">{{ t('loadingProduct') }}</p>
  </div>
</template>

<style scoped>

</style>

<script setup>
import { useI18n, useProductDetailPage } from './Main.js';

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const { product, add_to_cart, postCart, currencySymbol } =
  useProductDetailPage(() => props.id);
const { t } = useI18n();
</script>

<style scoped>
/* Главный контейнер страницы */
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Roboto', sans-serif;
}

/* Двухколоночный макет (флексбокс переносится на мобильных) */
.product-detail-layout {
  display: flex;
  gap: 48px;
  align-items: flex-start;
}

@media (max-width: 960px) {
  .product-detail-layout {
    flex-direction: column;
    gap: 24px;
  }
}

/* Левая колонка - Медиа */
.product-media-col {
  flex: 1.2;
  width: 100%;
}

.carousel-wrapper {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background-color: #fcfcfc;
}

.no-image-detail {
  width: 100%;
  height: 450px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  border-radius: 16px;
}

/* Правая колонка - Контент */
.product-info-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.product-detail-title {
  font-size: 32px;
  font-weight: 700;
  color: #212121;
  margin-bottom: 16px;
  line-height: 1.2;
}

/* Секция цены */
.product-price-section {
  margin-bottom: 12px;
}

.price-value {
  font-size: 28px;
  font-weight: 700;
  color: #2e7d32; /* Зеленый цвет для цены */
}

/* Статус наличия */
.stock-status {
  display: inline-flex;
  align-items: center;
  font-size: 14px;
  color: #43a047;
  font-weight: 500;
  margin-bottom: 16px;
}

.stock-status.out-of-stock {
  color: #e53935;
}

/* Описание */
.product-description-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 8px;
}

.description-text {
  font-size: 16px;
  color: #616161;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line; /* Сохраняет переносы строк из базы данных */
}

/* Кнопка купить */
.buy-button {
  text-transform: none;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.5px;
  height: 48px !important;
  border-radius: 8px;
}

/* Спиннер загрузки */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #757575;
}
</style>
