import { computed, unref } from 'vue'

/**
 * Composable pour gérer les URLs d'images du CMS
 * Aligne la résolution des file:// sur la liste de fichiers KQL (comme MSS).
 */
export const useCmsImage = (files?: Array<any> | { value: Array<any> }) => {
  const config = useRuntimeConfig()
  const cmsUrl = config.public.kirbyUrl || 'http://localhost:8000'

  const filesByUuid = computed(() => {
    const list = files ? unref(files) : []
    const map: Record<string, any> = {}
    list?.forEach((file: any) => {
      if (file?.uuid) {
        map[file.uuid] = file
        map[`file://${file.uuid}`] = file
      }
    })
    return map
  })

  const resolveFileUrl = (value: string) => {
    const match = value.match(/file:\/\/[a-z0-9]+/i)
    const normalized = match ? match[0] : value
    const file = filesByUuid.value[normalized] || filesByUuid.value[normalized.replace('file://', '')]
    if (file?.url) return normalizeAbsoluteUrl(file.url)
    if (file?.reg?.url) return normalizeAbsoluteUrl(file.reg.url)
    if (file?.small?.url) return normalizeAbsoluteUrl(file.small.url)
    return getFileProxyUrl(normalized) || normalized
  }

  const getCmsImageUrl = (url: string): string => {
    if (!url) return ''

    if (url.startsWith('file://')) {
      return resolveFileUrl(url)
    }

    if (url.startsWith('/')) return url

    return normalizeAbsoluteUrl(url)
  }

  const getFileProxyUrl = (value: string) => {
    const match = value.match(/file:\/\/([a-z0-9]+)/i)
    if (!match) return null
    return `/api/file/${match[1]}`
  }

  const normalizeAbsoluteUrl = (value: string) => {
    if (!value) return value
    try {
      const cms = new URL(cmsUrl)
      const target = new URL(value)
      if (cms.origin === target.origin) {
        return `${target.pathname}${target.search}${target.hash}`
      }
    } catch {
      // Ignore malformed URLs and fall back to original value.
    }
    return value
  }

  return {
    getCmsImageUrl
  }
}
