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
    // Préférer les versions redimensionnées (plus légères) à l'original
    if (file?.reg?.url) return ensureAbsolute(file.reg.url)
    if (file?.large?.url) return ensureAbsolute(file.large.url)
    if (file?.small?.url) return ensureAbsolute(file.small.url)
    if (file?.url) return ensureAbsolute(file.url)
    return normalized
  }

  const getCmsImageUrl = (url: string): string => {
    if (!url) return ''

    if (url.startsWith('file://')) {
      return resolveFileUrl(url)
    }

    if (url.startsWith('/')) return `${cmsUrl}${url}`

    return ensureAbsolute(url)
  }

  const ensureAbsolute = (value: string) => {
    if (!value) return value
    // URLs relatives → préfixer avec l'URL du CMS
    if (value.startsWith('/')) return `${cmsUrl}${value}`
    // URLs absolues → retourner telles quelles
    return value
  }

  return {
    getCmsImageUrl
  }
}
