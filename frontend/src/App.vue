<template>
  <div id="app-layout">
    <!-- Навигационная панель (Шапка) -->
    <nav class="navbar">
      <div class="nav-container">
        <div class="nav-logo">
          <router-link to="/profile" class="logo-link">MyAuthApp</router-link>
        </div>
        
        <ul class="nav-links">
          <li
            ref="languageSwitcherRef"
            class="language-switcher"
            @keydown.esc="isLanguageMenuOpen = false"
          >
            <button
              id="language-select"
              type="button"
              class="language-control"
              :aria-label="t('language')"
              aria-haspopup="menu"
              :aria-expanded="isLanguageMenuOpen"
              aria-controls="language-menu"
              @click="isLanguageMenuOpen = !isLanguageMenuOpen"
            >
              {{ languageOptions.find((option) => option.value === locale)?.label }}
              <span class="language-chevron" aria-hidden="true"></span>
            </button>
            <div
              v-show="isLanguageMenuOpen"
              id="language-menu"
              class="language-menu"
              role="menu"
              :aria-label="t('language')"
            >
              <button
                v-for="option in languageOptions"
                :key="option.value"
                type="button"
                class="language-option"
                :class="{ active: locale === option.value }"
                role="menuitemradio"
                :aria-checked="locale === option.value"
                @click="selectLanguage(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </li>
          <!-- Ссылки для гостей (показываются, если токена нет) -->
          <template v-if="!isLoggedIn">
            <li>
              <router-link to="/login" class="nav-item" active-class="active">{{ t('login') }}</router-link>
            </li>
            <li>
              <router-link to="/register" class="nav-item" active-class="active">{{ t('register') }}</router-link>
            </li>
            <li>
              <router-link to="/catalog" class="nav-item" active-class="active">{{ t('catalog') }}</router-link>
            </li>
          </template>

          <!-- Ссылки для авторизованных пользователей -->
          <template v-else>
            <li>
              <router-link to="/profile" class="nav-item" active-class="active">{{ t('profile') }}</router-link>
            </li>
            <li>
              <router-link to="/catalog" class="nav-item" active-class="active">{{ t('catalog') }}</router-link>
            </li>
            <li>
              <router-link to="/cart" class="nav-item" active-class="active">{{ t('cart') }}</router-link>
            </li>
            <li>
              <button @click="handleLogout" class="btn-logout">{{ t('logout') }}</button>
            </li>
          </template>
        </ul>
      </div>
    </nav>

    <!-- Основной контент страницы -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useApp, useI18n } from './views/Main.js';

const { isLoggedIn, handleLogout } = useApp();
const { locale, setLocale, t } = useI18n();
const languageOptions = [
  { value: 'ru', label: 'Русский' },
  { value: 'uk', label: 'Українська' },
  { value: 'en', label: 'English' },
];
const languageSwitcherRef = ref(null);
const isLanguageMenuOpen = ref(false);

const selectLanguage = (value) => {
  setLocale(value);
  isLanguageMenuOpen.value = false;
};

const closeLanguageMenuOnOutsideClick = (event) => {
  if (!languageSwitcherRef.value?.contains(event.target)) {
    isLanguageMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeLanguageMenuOnOutsideClick);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeLanguageMenuOnOutsideClick);
});
</script>

<style scoped>
#app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: sans-serif;
  background-color: #f9fafb;
}

.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  font-size: 1.25rem;
  font-weight: 700;
  color: #4f46e5;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
}

.language-switcher {
  position: relative;
}

.nav-item,
.language-control,
.btn-logout {
  box-sizing: border-box;
  min-height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.75rem;
  border: 1px solid transparent;
  border-radius: 0.375rem;
  background-color: transparent;
  color: #4b5563;
  font: 500 0.937rem sans-serif;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.language-control {
  gap: 0.5rem;
}

.language-chevron {
  width: 0.45rem;
  height: 0.45rem;
  border-right: 1.5px solid currentColor;
  border-bottom: 1.5px solid currentColor;
  transform: translateY(-0.125rem) rotate(45deg);
}

.language-menu {
  position: absolute;
  z-index: 10;
  top: calc(100% + 0.375rem);
  right: 0;
  min-width: 100%;
  padding: 0.25rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.language-option {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 2.5rem;
  padding: 0.5rem 0.75rem;
  border: 0;
  border-radius: 0.375rem;
  background: transparent;
  color: #4b5563;
  font: 500 0.937rem sans-serif;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
}

.language-option:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.language-option.active {
  color: #4f46e5;
  background-color: #eeebff;
}

.nav-item:hover,
.language-control:hover,
.btn-logout:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.nav-item:focus-visible,
.language-control:focus-visible,
.language-option:focus-visible,
.btn-logout:focus-visible {
  outline: 2px solid #4f46e5;
  outline-offset: 2px;
}

/* Стиль активной ссылки роутера */
.nav-item.active {
  color: #4f46e5;
  background-color: #eeebff;
}

.main-content {
  flex: 1;
}
</style>
