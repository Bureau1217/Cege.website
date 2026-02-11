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
      siteUrl: process.env.SITE_URL || 'https://cegeswiss.com',
    },
  },
  css: [
    '@/assets/styles/main.scss'
  ],
  ssr: true,
  nitro: {
    preset: process.env.NITRO_PRESET || undefined,
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_CH' },
        { property: 'og:site_name', content: 'CEGE Swiss' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
      style: [
        {
          innerHTML: '.app-content { opacity: 0; } .app-content.is-ready { opacity: 1; transition: opacity 0.3s ease; }'
        }
      ]
    }
  }
})
