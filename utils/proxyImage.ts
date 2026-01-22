/**
 * Transforme une URL HTTP en URL proxy pour éviter le mixed content
 */
export const proxyImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''

  // Si c'est déjà une URL relative ou HTTPS, ne pas modifier
  if (url.startsWith('/') || url.startsWith('https://')) {
    return url
  }

  // Si c'est une URL HTTP, utiliser le proxy
  if (url.startsWith('http://')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`
  }

  return url
}
