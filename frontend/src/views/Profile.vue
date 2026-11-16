<template>
  <div class="profile-container">
    <div class="profile-card">
      
      <!-- Шапка профиля -->
      <div class="profile-header">
        <div class="user-info">
          <div class="avatar">U</div>
          <div>
            <h1>{{ t('profileTitle') }}</h1>
            <p class="subtitle">{{ t('profileSubtitle') }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="btn btn-logout">{{ t('logout') }}</button>
      </div>

      <!-- Данные пользователя -->
      <div class="profile-body">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">{{ t('emailUserId') }}</span>
            <!-- Выводим email с безопасной проверкой ?. на случай, если данные еще грузятся -->
            <div class="info-value">
              {{ user?.email || t('loadingUser') }}
            </div>
          </div>
          
          <div class="info-item">
            <span class="info-label">{{ t('username') }}</span>
            <div class="info-value">
              {{ user?.username || t('loading') }}
            </div>
          </div>
        </div>
        <div class="orders-section" style="margin-top: 24px;">
  <h3>{{ t('myOrders', { count: orders.length }) }}</h3>

  <p v-if="loadingOrders">{{ t('loadingOrders') }}</p>
  <p v-else-if="orders.length === 0">{{ t('noOrders') }}</p>

  <div v-else class="orders-list">
    <div
      v-for="order in orders"
      :key="order.id"
      style="border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 12px;"
    >
      <div style="display: flex; justify-content: space-between; font-weight: bold;">
        <span>{{ t('order', { id: order.id, date: order.created_at }) }}</span>
        <span>{{ order.is_paid ? t('paid') : t('awaitingPayment') }}</span>
        <span>{{ order.total_price }} {{ getCurrencySymbol(order.currency) }}</span>
      </div>

      <ul style="margin-top: 10px; padding-left: 20px;">
        <li v-for="item in order.items" :key="item.id">
          {{ item.product_name }} — {{ item.quantity }} {{ t('pieces') }} ({{ item.price }} {{ getCurrencySymbol(order.currency) }})
        </li>
      </ul>

      <button
        v-if="!order.is_paid && order.payment_url"
        style="margin-top: 10px; padding: 6px 12px; background: #28a745; color: #fff; border: none; border-radius: 6px; cursor: pointer;"
        @click="payOrder(order.payment_url)"
      >
        {{ t('payNow') }}
      </button>
    </div>
  </div>
</div>
      </div>

    </div>
  </div>
  
</template>

<script setup>
import { useI18n, useProfilePage } from './Main.js';

const {
  user,
  handleLogout,
  orders,
  loadingOrders,
  payOrder,
  getCurrencySymbol,
} =
  useProfilePage();
const { t } = useI18n();
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f3f4f6;
  padding: 2.5rem 1rem;
  font-family: sans-serif;
  box-sizing: border-box;
}
.profile-card {
  max-width: 768px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.profile-header {
  background-color: #4f46e5;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.avatar {
  height: 4rem;
  width: 4rem;
  background-color: #e0e7ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4338ca;
  font-size: 1.5rem;
  font-weight: 700;
}
.profile-header h1 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}
.subtitle {
  color: #c7d2fe;
  font-size: 0.875rem;
  margin: 0;
}
.profile-body {
  padding: 2rem;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.info-item {
  display: flex;
  flex-direction: column;
}
.info-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.info-value {
  margin-top: 0.25rem;
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}
.btn {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-logout {
  background-color: #ffffff;
  color: #dc2626;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.btn-logout:hover {
  background-color: #fef2f2;
}
</style>
