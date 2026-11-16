<template>
  <div style="text-align: center; padding: 50px;">
    <h1>{{ t('paymentSuccess') }}</h1>
    <p v-if="orderId">{{ t('orderAccepted', { id: orderId }) }}</p>
    <router-link to="/">{{ t('backHome') }}</router-link>
  </div>
</template>

<script setup>
import { useI18n, usePaymentSuccess } from './Main.js';

const { orderId } = usePaymentSuccess();
const { t } = useI18n();
</script>

