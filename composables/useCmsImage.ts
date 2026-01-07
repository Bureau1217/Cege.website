/**
 * Composable pour gérer les URLs d'images du CMS
 */
export const useCmsImage = () => {
  const config = useRuntimeConfig()
  const cmsUrl = config.public.kirbyUrl || 'http://localhost:8080'

  const getCmsImageUrl = (url: string): string => {
    if (!url) return ''

    // Si c'est un file:// UUID, passer par l'API proxy locale
    if (url.startsWith('file://')) {
      const uuid = url.replace('file://', '')
      return `/api/file/${uuid}`
    }

    // Si l'URL commence par /, ajouter le domaine CMS
    if (url.startsWith('/')) {
      return `${cmsUrl}${url}`
    }

    // Si l'URL est déjà complète, la retourner telle quelle
    return url
  }

  return {
    getCmsImageUrl
  }
}
