import { createRouter, createWebHistory } from 'vue-router';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Profile from '@/views/Profile.vue';
import ProductDetail from '@/views/Product-detail.vue';

const routes = [
  { path: '/login', component: Login, name: 'login' },
  { path: '/register', component: Register, name: 'register' },
  {
    path: '/profile',
    component: Profile,
    name: 'profile',
    meta: { requiresAuth: true }
  },
  { path: '/catalog', component: () => import('@/views/Catalog.vue'), name: 'catalog' },
  {
    path: '/catalog/:id',
    name: 'product-detail',
    component: ProductDetail,
    props: true
  },
  { path: '/cart', component: () => import('@/views/Cart.vue'), name: 'cart' },
  { path: '/payment-success', component: () => import('@/views/PaymentSuccess.vue'), name: 'payment-success' },
  { path: '/payment-failed', component: () => import('@/views/PaymentFailed.vue'), name: 'payment-failed' },

  // Этот маршрут ВСЕГДА должен быть самым последним в списке:
  { path: '/:pathMatch(.*)*', redirect: '/login' }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

// Глобальный перехватчик для проверки токена перед переходом на страницу
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user_token'); // Проверяем наличие токена dj-rest-auth
  console.log('Попытка перехода на:', to.fullPath, 'откуда:', from.fullPath);
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Если страница требует авторизации, а токена нет — отправляем на логин
    next('/login');
  } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
    // Если пользователь уже вошел, не пускаем его на страницы входа/регистрации
    next('/profile');
  } else {
    next();
  }
});

export default router;
