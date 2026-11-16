<template>
  <div style="text-align: center; padding: 50px;">
    <h1>{{ t('paymentFailed') }}</h1>
    <p v-if="orderId">{{ t('paymentFailedDetails', { id: orderId }) }}</p>
    <router-link to="/">{{ t('backHome') }}</router-link>
  </div>
</template>

<script setup>
import { useI18n, usePaymentFailed } from './Main.js';

const { orderId } = usePaymentFailed();
const { t } = useI18n();
</script>
