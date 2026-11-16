<template>
  <div class="catalog-container">
    <h1>{{ t('catalogTitle') }}</h1>
    <div class="Products-grid">
      <!-- 1. Начинаем цикл по товарам -->
      <div v-for="product in displayedProducts" :key="product.id" class="Products-card">
        
        <!-- 2. Блок карусели картинок (везде заменяем p на product) -->
        <div v-if="product.images && product.images.length" class="catalog-carousel-wrapper">
          <v-carousel
            hide-delimiters
            :show-arrows="product.images.length > 1"
            height="250"
          >
            <v-carousel-item
              v-for="imgObj in product.images"
              :key="imgObj.id"
              :src="imgObj.image"
              alt="Product catalog image"
              cover
            ></v-carousel-item>
          </v-carousel>
        </div>

        <!-- 3. Если у товара нет картинок, показываем заглушку -->
        <div v-else class="no-image-placeholder">
          {{ t('noImage') }}
        </div>

        <!-- 4. Описание и информация о товаре -->
        <div class="product-info-block">
          <router-link :to="`/catalog/${product.id}`" class="product-title-link">
            {{ product.displayName }}
          </router-link>
          <p class="Products-description">{{ product.displayDescription }}</p>
          <p class="product-price">{{ t('price') }}: {{ product.price }} {{ currencySymbol }}</p>
        </div>


      </div> <!-- Конец Products-card (теперь закрывается тут!) -->
    </div>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useCatalogPage, useI18n } from './Main.js';

const { products, currencySymbol } = useCatalogPage();
const { locale, t } = useI18n();

const englishProductTranslations = {
  'Стул обеденный Лофт': {
    name: 'Loft Dining Chair',
    description:
      'A comfortable chair with a sturdy metal frame and a cushioned seat.',
  },
  'Стол письменный Норд': {
    name: 'Nord Writing Desk',
    description: 'A compact desk with a spacious work surface.',
  },
  'Книжный стеллаж Лайн': {
    name: 'Line Bookshelf',
    description: 'Open shelving for books, decor, and everyday essentials.',
  },
  'Настольная лампа Орбита': {
    name: 'Orbita Table Lamp',
    description: 'A minimalist lamp with an adjustable light direction.',
  },
  'Кофейный столик Модерн': {
    name: 'Modern Coffee Table',
    description: 'A compact living room table with sturdy legs.',
  },
  'Кресло Релакс': {
    name: 'Relax Armchair',
    description: 'A soft, high-back armchair for relaxing and reading.',
  },
  'Комод Сканди': {
    name: 'Scandi Dresser',
    description: 'A dresser with spacious drawers for clothes and accessories.',
  },
  'Зеркало настенное Арка': {
    name: 'Arka Wall Mirror',
    description:
      'A wall mirror with a minimalist frame, ideal for an entryway or bedroom.',
  },
  'Кровать двуспальная Эко': {
    name: 'Eco Double Bed',
    description: 'A double bed with a sturdy base and understated design.',
  },
  'Тумба прикроватная Компакт': {
    name: 'Compact Bedside Table',
    description: 'A practical bedside table with a drawer and an open shelf.',
  },
};

const ukrainianProductTranslations = {
  'Стул обеденный Лофт': {
    name: 'Обідній стілець «Лофт»',
    description:
      'Зручний стілець із міцним металевим каркасом і м’яким сидінням.',
  },
  'Стол письменный Норд': {
    name: 'Письмовий стіл «Норд»',
    description: 'Компактний письмовий стіл із просторою робочою поверхнею.',
  },
  'Книжный стеллаж Лайн': {
    name: 'Книжковий стелаж «Лайн»',
    description: 'Відкритий стелаж для книжок, декору та домашніх дрібниць.',
  },
  'Настольная лампа Орбита': {
    name: 'Настільна лампа «Орбіта»',
    description: 'Лаконічна лампа з регульованим напрямком світла.',
  },
  'Кофейный столик Модерн': {
    name: 'Журнальний столик «Модерн»',
    description: 'Невеликий столик для вітальні зі стійкими ніжками.',
  },
  'Кресло Релакс': {
    name: 'Крісло «Релакс»',
    description: 'М’яке крісло з високою спинкою для відпочинку та читання.',
  },
  'Комод Сканди': {
    name: 'Комод «Сканди»',
    description:
      'Комод із місткими шухлядами для зберігання одягу та аксесуарів.',
  },
  'Зеркало настенное Арка': {
    name: 'Настінне дзеркало «Арка»',
    description:
      'Настінне дзеркало в мінімалістичній рамі для передпокою або спальні.',
  },
  'Кровать двуспальная Эко': {
    name: 'Двоспальне ліжко «Еко»',
    description: 'Двоспальне ліжко з міцною основою та стриманим дизайном.',
  },
  'Тумба прикроватная Компакт': {
    name: 'Приліжкова тумба «Компакт»',
    description: 'Практична тумба з висувною шухлядою та відкритою полицею.',
  },
};

const displayedProducts = computed(() =>
  products.value.map((product) => {
    const translation =
      locale.value === 'en'
        ? englishProductTranslations[product.name]
        : locale.value === 'uk'
          ? ukrainianProductTranslations[product.name]
          : undefined;

    return {
      ...product,
      displayName: translation?.name || product.name,
      displayDescription: translation?.description || product.description,
    };
  }),
);
</script>



<style scoped>
/* Контейнер для всего каталога */
.catalog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Сетка для карточек (выстраивает их в ряд) */
.Products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

/* Стили самой карточки товара */
.Products-card {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.Products-card:hover {
  transform: translateY(-4px);
}

/* Ограничиваем обертку карусели, чтобы она не растягивалась */
.catalog-carousel-wrapper {
  width: 100%;
  height: 250px;
}

/* Заглушка, если картинок нет */
.no-image-placeholder {
  width: 100%;
  height: 250px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}

/* Стили текстового блока внутри карточки */
.product-info-block {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.product-title-link {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-decoration: none;
}

.product-title-link:hover {
  color: #1976d2; /* Цвет ссылки при наведении */
}

.Products-description {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.product-price {
  font-weight: bold;
  color: #2e7d32;
  font-size: 16px;
  margin: 0;
}
</style>
