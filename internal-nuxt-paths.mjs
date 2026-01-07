import { joinURL } from 'ufo'

const appConfig = {
  baseURL: process.env.NUXT_APP_BASE_URL || '/',
  buildAssetsDir: process.env.NUXT_BUILD_ASSETS_DIR || '/_nuxt/',
  cdnURL: process.env.NUXT_APP_CDN_URL || '',
  buildId: process.env.NUXT_APP_BUILD_ID || 'dev'
}

export const getAppConfig = () => appConfig
export const baseURL = () => appConfig.baseURL
export const buildAssetsDir = () => appConfig.buildAssetsDir
export const appBuildId = () => appConfig.buildId

export const buildAssetsURL = (p = '') => {
  const path = p.startsWith('/') ? p.slice(1) : p
  const base = appConfig.cdnURL || appConfig.baseURL
  return joinURL(base, appConfig.buildAssetsDir, path)
}

export const publicAssetsURL = (p = '') => {
  const path = p.startsWith('/') ? p.slice(1) : p
  const base = appConfig.cdnURL || appConfig.baseURL
  return joinURL(base, path)
}
