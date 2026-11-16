import { computed, onMounted, ref, toValue, watch } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const API_URL = 'http://127.0.0.1:8000/api';

const messages = {
  ru: {
    login: 'Войти',
    register: 'Регистрация',
    catalog: 'Каталог',
    profile: 'Профиль',
    cart: 'Корзина',
    logout: 'Выйти',
    language: 'Язык',
    email: 'Email адрес',
    password: 'Пароль',
    loginTitle: 'Войти в аккаунт',
    noAccount: 'Нет аккаунта?',
    createAccount: 'Зарегистрироваться',
    haveAccount: 'Уже есть аккаунт?',
    createAccountButton: 'Создать аккаунт',
    cartTitle: 'Корзина товаров',
    price: 'Цена',
    orderParameters: 'Параметры заказа',
    itemCount: 'Количество товаров',
    pieces: 'шт.',
    total: 'Итого',
    placeOrder: 'Оформить заказ',
    emptyCart: 'Ваша корзина пуста',
    emptyCartHint: 'Добавьте товары из каталога, чтобы отобразить их здесь.',
    backToCatalog: 'Вернуться в каталог',
    catalogTitle: 'Каталог товаров',
    noImage: 'Нет изображения',
    noImages: 'Нет изображений',
    inStock: 'В наличии: {count} шт.',
    outOfStock: 'Нет в наличии',
    productDescription: 'Описание товара',
    addToCart: 'Добавить в корзину',
    loadingProduct: 'Загрузка информации о товаре...',
    profileTitle: 'Личный кабинет',
    profileSubtitle: 'Управление профилем',
    emailUserId: 'Email (ID пользователя)',
    username: 'Имя пользователя (Username)',
    loadingUser: 'Загрузка данных...',
    loading: 'Загрузка...',
    myOrders: 'Мои заказы ({count})',
    loadingOrders: 'Загрузка заказов...',
    noOrders: 'У вас пока нет оформленных заказов.',
    order: 'Заказ #{id} ({date})',
    genericDescription: 'Описание товара',
    sofaDescription: 'Описание дивана',
    paid: '✅ Оплачен',
    awaitingPayment: '⏳ Ожидает оплаты',
    payNow: 'Оплатить сейчас',
    paymentSuccess: 'Оплата прошла успешно!',
    orderAccepted: 'Заказ №{id} принят в обработку.',
    paymentFailed: 'Ошибка при оплате',
    paymentFailedDetails: 'Не удалось оплатить заказ №{id}. Попробуйте еще раз.',
    backHome: 'Вернуться на главную',
    homeWelcome: 'Добро пожаловать в Django + Vue SPA',
    serverMissingToken: 'Сервер не вернул токен авторизации.',
    loginError: 'Ошибка: {message}',
    invalidCredentials: 'Неверный email или пароль.',
    loginRequired: 'Пожалуйста, войдите в систему, чтобы добавить товар в корзину.',
    quantityLimit: 'Вы не можете добавить больше товаров, чем есть в наличии.',
    addedToCart: 'Товар добавлен в корзину!',
    registrationError: 'Ошибка сервера:\n{message}',
    orderError: 'Ошибка оформления заказа',
  },
  uk: {
    login: 'Увійти',
    register: 'Реєстрація',
    catalog: 'Каталог',
    profile: 'Профіль',
    cart: 'Кошик',
    logout: 'Вийти',
    language: 'Мова',
    email: 'Електронна пошта',
    password: 'Пароль',
    loginTitle: 'Увійти до акаунта',
    noAccount: 'Немає акаунта?',
    createAccount: 'Зареєструватися',
    haveAccount: 'Вже маєте акаунт?',
    createAccountButton: 'Створити акаунт',
    cartTitle: 'Кошик товарів',
    price: 'Ціна',
    orderParameters: 'Параметри замовлення',
    itemCount: 'Кількість товарів',
    pieces: 'шт.',
    total: 'Разом',
    placeOrder: 'Оформити замовлення',
    emptyCart: 'Ваш кошик порожній',
    emptyCartHint: 'Додайте товари з каталогу, щоб побачити їх тут.',
    backToCatalog: 'Повернутися до каталогу',
    catalogTitle: 'Каталог товарів',
    noImage: 'Немає зображення',
    noImages: 'Немає зображень',
    inStock: 'У наявності: {count} шт.',
    outOfStock: 'Немає в наявності',
    productDescription: 'Опис товару',
    addToCart: 'Додати до кошика',
    loadingProduct: 'Завантаження інформації про товар...',
    profileTitle: 'Особистий кабінет',
    profileSubtitle: 'Керування профілем',
    emailUserId: 'Email (ID користувача)',
    username: "Ім'я користувача (Username)",
    loadingUser: 'Завантаження даних...',
    loading: 'Завантаження...',
    myOrders: 'Мої замовлення ({count})',
    loadingOrders: 'Завантаження замовлень...',
    noOrders: 'У вас поки немає оформлених замовлень.',
    order: 'Замовлення №{id} ({date})',
    genericDescription: 'Опис товару',
    sofaDescription: 'Опис дивана',
    paid: '✅ Оплачено',
    awaitingPayment: '⏳ Очікує оплати',
    payNow: 'Оплатити зараз',
    paymentSuccess: 'Оплату успішно проведено!',
    orderAccepted: 'Замовлення №{id} прийнято в обробку.',
    paymentFailed: 'Помилка під час оплати',
    paymentFailedDetails: 'Не вдалося оплатити замовлення №{id}. Спробуйте ще раз.',
    backHome: 'Повернутися на головну',
    homeWelcome: 'Ласкаво просимо до Django + Vue SPA',
    serverMissingToken: 'Сервер не повернув токен авторизації.',
    loginError: 'Помилка: {message}',
    invalidCredentials: 'Неправильна електронна пошта або пароль.',
    loginRequired: 'Будь ласка, увійдіть, щоб додати товар до кошика.',
    quantityLimit: 'Не можна додати більше товарів, ніж є в наявності.',
    addedToCart: 'Товар додано до кошика!',
    registrationError: 'Помилка сервера:\n{message}',
    orderError: 'Помилка оформлення замовлення',
  },
  en: {
    login: 'Log in',
    register: 'Sign up',
    catalog: 'Catalog',
    profile: 'Profile',
    cart: 'Cart',
    logout: 'Log out',
    language: 'Language',
    email: 'Email address',
    password: 'Password',
    loginTitle: 'Log in to your account',
    noAccount: "Don't have an account?",
    createAccount: 'Sign up',
    haveAccount: 'Already have an account?',
    createAccountButton: 'Create account',
    cartTitle: 'Shopping cart',
    price: 'Price',
    orderParameters: 'Order summary',
    itemCount: 'Number of items',
    pieces: 'pcs.',
    total: 'Total',
    placeOrder: 'Place order',
    emptyCart: 'Your cart is empty',
    emptyCartHint: 'Add products from the catalog to see them here.',
    backToCatalog: 'Back to catalog',
    catalogTitle: 'Product catalog',
    noImage: 'No image',
    noImages: 'No images',
    inStock: 'In stock: {count} pcs.',
    outOfStock: 'Out of stock',
    productDescription: 'Product description',
    addToCart: 'Add to cart',
    loadingProduct: 'Loading product information...',
    profileTitle: 'Account',
    profileSubtitle: 'Manage your profile',
    emailUserId: 'Email (user ID)',
    username: 'Username',
    loadingUser: 'Loading user data...',
    loading: 'Loading...',
    myOrders: 'My orders ({count})',
    loadingOrders: 'Loading orders...',
    noOrders: 'You have no orders yet.',
    order: 'Order #{id} ({date})',
    genericDescription: 'Product description',
    sofaDescription: 'Sofa description',
    paid: '✅ Paid',
    awaitingPayment: '⏳ Awaiting payment',
    payNow: 'Pay now',
    paymentSuccess: 'Payment successful!',
    orderAccepted: 'Order #{id} has been received.',
    paymentFailed: 'Payment failed',
    paymentFailedDetails: 'Could not pay for order #{id}. Please try again.',
    backHome: 'Back to home',
    homeWelcome: 'Welcome to Django + Vue SPA',
    serverMissingToken: 'The server did not return an authentication token.',
    loginError: 'Error: {message}',
    invalidCredentials: 'Invalid email or password.',
    loginRequired: 'Please log in to add this product to your cart.',
    quantityLimit: 'You cannot add more items than are in stock.',
    addedToCart: 'Product added to cart!',
    registrationError: 'Server error:\n{message}',
    orderError: 'Could not place the order',
  },
};

const savedLocale =
  typeof localStorage === 'undefined' ? null : localStorage.getItem('locale');
const locale = ref(
  typeof savedLocale === 'string' && Object.hasOwn(messages, savedLocale)
    ? savedLocale
    : 'ru',
);

export function useI18n() {
  const setLocale = (value) => {
    if (!Object.hasOwn(messages, value)) return;
    locale.value = value;
    localStorage.setItem('locale', value);
    document.documentElement.lang = value;
  };

  const t = (key, params = {}) => {
    const template = messages[locale.value][key] || messages.ru[key] || key;
    return template.replace(/\{(\w+)\}/g, (_, name) => params[name] ?? '');
  };

  return { locale, setLocale, t };
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = locale.value;
}

export const getCurrencySymbol = (code) => {
  const symbols = {
    UAH: '₴',
    USD: '$',
    EUR: '€',
    GBP: '£',
    PLN: 'zł',
  };
  return symbols[code] || code || '₴';
};

export function useApp() {
  const route = useRoute();
  const router = useRouter();
  const isLoggedIn = ref(false);

  const checkAuth = () => {
    isLoggedIn.value = !!localStorage.getItem('user_token');
  };

  onMounted(checkAuth);
  watch(() => route.path, checkAuth);

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('cart');
    router.push('/login');
  };

  return { isLoggedIn, handleLogout };
}

export function useCart() {
  const cartItems = ref([]);

  const loadCart = () => {
    const storedCart = localStorage.getItem('cart');
    const localCart = storedCart ? JSON.parse(storedCart) : [];

    cartItems.value = localCart.map((item) => ({
      id: item.id || item.product_id,
      name: item.id === 2 ? 'test1' : 'test',
      descriptionKey:
        item.id === 2 ? 'sofaDescription' : 'genericDescription',
      price: item.id === 2 ? 200.0 : 100.0,
      quantity: item.quantity,
      image: item.id === 2 ? 'https://googleapis.com' : null,
    }));
  };

  const syncWithBackend = async () => {
    const token = localStorage.getItem('user_token');
    const rawData = cartItems.value.map((item) => ({
      id: item.id,
      quantity: item.quantity,
    }));

    localStorage.setItem('cart', JSON.stringify(rawData));

    if (token) {
      try {
        await axios.post(`${API_URL}/cart/cart/`, rawData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Ошибка синхронизации с бэкендом:', error);
      }
    }
  };

  const updateQuantity = async (id, newQty) => {
    const item = cartItems.value.find((cartItem) => cartItem.id === id);
    if (item) {
      item.quantity = newQty;
      await syncWithBackend();
    }
  };

  const removeItem = async (id) => {
    cartItems.value = cartItems.value.filter((item) => item.id !== id);
    await syncWithBackend();
  };

  const totalPrice = computed(() =>
    cartItems.value
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2),
  );
  const totalCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity, 0),
  );

  onMounted(loadCart);

  return {
    cartItems,
    totalCount,
    totalPrice,
    updateQuantity,
    removeItem,
  };
}

export function useCatalog() {
  const products = ref([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/catalog/`);
      products.value = response.data;
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
    }
  };

  onMounted(fetchProducts);

  return { products };
}

export function useLogin() {
  const { t } = useI18n();
  const email = ref('');
  const password = ref('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/accounts/api/v1/auth/login`,
        {
          email: email.value,
          password: password.value,
        },
      );

      console.log('Вход выполнен успешно!', response.data);

      const token = response.data.key || response.data.access;

      if (token) {
        localStorage.setItem('user_token', token);

        try {
          const cartResponse = await axios.get(`${API_URL}/cart/cart/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          localStorage.setItem('cart', JSON.stringify(cartResponse.data));
          console.log('Корзина пользователя успешно синхронизирована при входе!');
        } catch (cartError) {
          console.error('Не удалось загрузить корзину с сервера:', cartError);
          localStorage.setItem('cart', JSON.stringify([]));
        }

        router.push('/profile');
      } else {
        alert(t('serverMissingToken'));
      }
    } catch (error) {
      console.error('Ошибка входа:', error.response?.data);

      const serverError = error.response?.data;
      if (serverError?.non_field_errors) {
        alert(
          t('loginError', {
            message: serverError.non_field_errors.join(', '),
          }),
        );
      } else {
        alert(t('invalidCredentials'));
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    router.push('/login');
  };

  return { email, password, handleLogin, handleLogout };
}

export function useProductDetail(productId) {
  const { t } = useI18n();
  const product = ref(null);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/products/catalog/${toValue(productId)}/`,
      );
      product.value = response.data;
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
    }
  };

  onMounted(fetchProducts);
  watch(productId, fetchProducts);

  const add_to_cart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const token = localStorage.getItem('user_token');
      const existingItemIndex = cart.findIndex(
        (item) => item.id === product.value.id,
      );

      if (!token) {
        alert(t('loginRequired'));
        return;
      }

      if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({ id: product.value.id, quantity: 1 });
      }

      const quantityInCart =
        cart.find((item) => item.id === product.value.id)?.quantity || 0;
      if (quantityInCart > product.value.quantity) {
        alert(t('quantityLimit'));
        return;
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      alert(t('addedToCart'));
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
    }
  };

  const postCart = async () => {
    const token = localStorage.getItem('user_token');

    if (!token) {
      console.error('Пользователь не авторизован (токен отсутствует в localStorage)');
      return;
    }

    const storedCart = localStorage.getItem('cart');
    const currentCartData = storedCart ? JSON.parse(storedCart) : [];

    try {
      const response = await axios.post(
        `${API_URL}/cart/cart/`,
        currentCartData,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(
        'Данные корзины привязаны к аккаунту dj-rest-auth:',
        response.data,
      );
    } catch (error) {
      console.error(
        'Ошибка аутентификации на бэкенде:',
        error.response?.status,
        error.response?.data,
      );
    }
  };

  return { product, add_to_cart, postCart };
}

export function useProfile() {
  const router = useRouter();
  const user = ref(null);

  onMounted(async () => {
    const token = localStorage.getItem('user_token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/accounts/api/v1/auth/user/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      user.value = response.data;
      console.log('Пользователь успешно верифицирован бэкендом:', response.data);
    } catch (error) {
      console.error(
        'Ошибка проверки токена (токен невалиден или истек):',
        error.response?.data,
      );
      localStorage.removeItem('user_token');
      router.push('/login');
    }
  });

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('cart');
    router.push('/login');
  };

  return { user, handleLogout };
}

export function useRegister() {
  const { t } = useI18n();
  const email = ref('');
  const password = ref('');
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/accounts/api/v1/auth/registration/`,
        {
          email: email.value,
          username: email.value.split('@')[0],
          password1: password.value,
          password2: password.value,
        },
      );

      console.log('Успешная регистрация!', response.data);

      if (response.data.key) {
        localStorage.setItem('user_token', response.data.key);
        router.push('/profile');
      } else {
        router.push('/login');
      }
    } catch (error) {
      const serverErrors = error.response?.data;
      console.error('Детали ошибки 400:', serverErrors);
      alert(
        t('registrationError', {
          message: JSON.stringify(serverErrors || error.message),
        }),
      );
    }
  };

  return { email, password, handleRegister };
}
export function useOrders() {
  const { t } = useI18n();
  const backendErrorText = ref('');

  const createOrder = async () => {
    backendErrorText.value = '';
    const token = localStorage.getItem('user_token');

    if (!token || token === 'undefined') {
      console.error('Пользователь не авторизован (токен отсутствует)');
      return;
    }

    const currentCartData = JSON.parse(localStorage.getItem('cart')) || {};

    try {
      const response = await axios.post(
        `${API_URL}/orders/create/`,
        currentCartData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      console.log('Ответ от сервера:', response.data);

      if (response.data.payment_url) {
        window.location.href = response.data.payment_url;
      } else {
        console.error('Сервер не вернул ссылку на оплату (payment_url)');
      }
    } catch (error) {
      console.error(
        'Ошибка при создании заказа:',
        error.response?.status,
        error.response?.data,
      );
      if (error.response?.data) {
        backendErrorText.value =
          error.response.data.error || t('orderError');
      }
    }
  };

  return { createOrder, backendErrorText };
}

function useCurrency() {
  const currency = ref('UAH');

  onMounted(async () => {
    const token = localStorage.getItem('user_token');
    if (!token || token === 'undefined') return;

    try {
      const response = await axios.get(`${API_URL}/orders/my/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (Array.isArray(response.data) && response.data.length > 0) {
        currency.value = response.data[0].currency || 'UAH';
      }
    } catch (error) {
      console.error('Не удалось загрузить валюту:', error);
    }
  });

  return computed(() => getCurrencySymbol(currency.value));
}

export function useCartPage() {
  const cart = useCart();
  const order = useOrders();
  const currencySymbol = useCurrency();

  return { ...cart, ...order, currencySymbol };
}

export function useCatalogPage() {
  const { products } = useCatalog();
  const currencySymbol = useCurrency();

  return { products, currencySymbol };
}

export function useProductDetailPage(productId) {
  const productDetail = useProductDetail(productId);
  const currencySymbol = useCurrency();

  return { ...productDetail, currencySymbol };
}

export function useProfilePage() {
  const profile = useProfile();
  const orders = ref([]);
  const loadingOrders = ref(false);

  const fetchMyOrders = async () => {
    const token = localStorage.getItem('user_token');
    if (!token || token === 'undefined') return;

    loadingOrders.value = true;
    try {
      const response = await axios.get(`${API_URL}/orders/my/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      orders.value = response.data;
    } catch (error) {
      console.error('Ошибка при загрузке истории заказов:', error);
    } finally {
      loadingOrders.value = false;
    }
  };

  const payOrder = (url) => {
    window.location.href = url;
  };

  onMounted(fetchMyOrders);

  return {
    ...profile,
    orders,
    loadingOrders,
    payOrder,
    getCurrencySymbol,
  };
}

export function usePaymentSuccess() {
  const route = useRoute();
  const orderId = route.query.order_id;

  onMounted(() => {
    localStorage.removeItem('cart');
  });

  return { orderId };
}

export function usePaymentFailed() {
  const route = useRoute();

  return { orderId: route.query.order_id };
}