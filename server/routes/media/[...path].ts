import { defineEventHandler, getRequestURL, getRouterParam, proxyRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const apiUrl = process.env.API_URL || runtimeConfig.public.kirbyUrl || 'http://localhost:8000'
  const pathParam = getRouterParam(event, 'path')
  const path = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '')
  const query = getRequestURL(event).search
  const base = apiUrl.replace(/\/$/, '')
  const target = `${base}/media/${path}${query}`

  return proxyRequest(event, target)
})
