<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h2>{{ t('loginTitle') }}</h2>
      </div>
      
      <form class="auth-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">{{ t('email') }}</label>
          <input 
            v-model="email"
            id="email" 
            type="email" 
            required 
            placeholder="example@mail.com"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">{{ t('password') }}</label>
          <input 
            v-model="password"
            id="password" 
            type="password" 
            required 
            placeholder="••••••••"
            class="form-input"
          />
        </div>

        <button type="submit" class="btn btn-primary">{{ t('login') }}</button>
      </form>
      
      <p class="auth-footer">
        {{ t('noAccount') }}
        <a href="/register" class="auth-link">{{ t('createAccount') }}</a>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useI18n, useLogin } from './Main.js';

const { email, password, handleLogin } = useLogin();
const { t } = useI18n();
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 0 1rem;
  font-family: sans-serif;
}

.auth-card {
  max-width: 400px;
  width: 100%;
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.auth-header h2 {
  text-align: center;
  font-size: 1.875rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #111827;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn {
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4f46e5;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.auth-footer {
  text-align: center;
  font-size: 0.875rem;
  color: #4b5563;
  margin-top: 1.5rem;
}

.auth-link {
  font-weight: 500;
  color: #4f46e5;
  text-decoration: none;
}

.auth-link:hover {
  text-decoration: underline;
}
</style>
