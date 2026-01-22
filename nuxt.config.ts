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
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      style: [
        {
          innerHTML: '.app-content { opacity: 0; } .app-content.is-ready { opacity: 1; transition: opacity 0.3s ease; }'
        }
      ]
    }
  }
})
