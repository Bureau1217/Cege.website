import { fileURLToPath } from 'node:url'

const appManifestPath = fileURLToPath(new URL('./app.manifest.json', import.meta.url))
const internalPaths = fileURLToPath(new URL('./internal-nuxt-paths.mjs', import.meta.url))

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  devServer: {
    host: '0.0.0.0',
    port: 3000
  },
  runtimeConfig: {

    public: {
      kirbyUrl: process.env.KIRBY_URL || 'http://localhost:8000'
    }
  },
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      }
    ]
  },
  nitro: {
    preset: 'node-server',
    inlineDynamicImports: true,
  },
  experimental: {
    // Force generation of the virtual manifest alias to avoid #app-manifest resolution errors in dev.
    appManifest: true,
  },
  alias: {
    // Ensure Vite can always resolve #app-manifest even before Nuxt writes .nuxt/manifest.
    '#app-manifest': appManifestPath,
    // Shim for #internal/nuxt/paths which fails to generate in this setup.
    '#internal/nuxt/paths': internalPaths,
  },
  app: {
    // Même logique que dans le projet Upload : assets servis sous /_nuxt avec base à la racine.
    baseURL: '/',
    buildAssetsDir: '/_nuxt/',
  },
  vite: {
    server: {
      // Force a dedicated HMR port to avoid collisions with stale dev servers.
      hmr: {
        host: 'localhost',
        port: 24680,
      },
    },
  },
  ssr: false,
  css: [
    '@/assets/styles/main.scss'
  ]
})
