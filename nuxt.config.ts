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
      title: 'CéGé GEORGES Erik - Contrôle électrique & sécurité',
      titleTemplate: '%s | CéGé GEORGES Erik',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'robots', content: 'index, follow' },
        { name: 'description', content: 'CéGé GEORGES Erik - Électricien à Genève spécialisé en contrôle électrique OIBT, diagnostic de conformité et sécurité électrique. Contrôle des installations électriques, bornes de recharge et photovoltaïque en Suisse romande.' },
        { name: 'keywords', content: 'CéGé GEORGES Erik, électricien Genève, contrôle OIBT Genève, contrôle électrique Genève, diagnostic conformité Genève, sécurité électrique Genève, contrôle installations électriques, bornes de recharge, photovoltaïque, Suisse romande' },
        { name: 'author', content: 'CéGé GEORGES Erik' },
        { name: 'geo.region', content: 'CH-GE' },
        { name: 'geo.placename', content: 'Genève' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_CH' },
        { property: 'og:site_name', content: 'CéGé GEORGES Erik - Contrôle électrique & sécurité' },
        { property: 'og:image', content: 'https://cegeswiss.com/Opengraph_Cege.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'CéGé GEORGES Erik - Contrôle électrique & sécurité' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: 'https://cegeswiss.com/Opengraph_Cege.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/Favicon_Cege.png' },
        { rel: 'apple-touch-icon', href: '/Favicon_Cege.png' },
      ],
      style: [
        {
          innerHTML: '.app-content { opacity: 0; } .app-content.is-ready { opacity: 1; transition: opacity 0.3s ease; }'
        }
      ]
    }
  }
})
