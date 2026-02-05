/**
 * Normalise une URL d'image CMS.
 * En production (statique), pas de proxy — on pointe directement vers le CMS.
 */
export const proxyImageUrl = (url: string | null | undefined): string => {
  if (!url) return ''

  // Forcer HTTPS en production uniquement (pas en dev/localhost)
  if (url.startsWith('http://') && !url.includes('localhost')) {
    return url.replace('http://', 'https://')
  }

  return url
}
