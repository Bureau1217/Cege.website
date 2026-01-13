// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  devServer: {
    port: 3001,
  },
  runtimeConfig: {
    public: {
      kirbyUrl: process.env.API_URL || 'http://localhost:8000',
    },
  },
  css: [
    '@/assets/styles/main.scss'
  ],
  ssr: true,
})
