<template>
  <main>
    <h1>{{ t('homeWelcome') }}</h1>
  </main>
</template>

<script setup>
import { useI18n } from './Main.js';

const { t } = useI18n();
</script>
