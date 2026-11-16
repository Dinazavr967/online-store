import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify' // Проверьте этот импорт

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Убедитесь, что autoImport включен!
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})