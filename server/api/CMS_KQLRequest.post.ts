export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Configuration Kirby (supporte API_URL pour rétrocompatibilité)
  const KIRBY_URL = process.env.KIRBY_URL || process.env.API_URL || 'http://localhost:8080'
  const KIRBY_USERNAME = process.env.API_AUTH_EMAIL || 'admin'
  const KIRBY_PASSWORD = process.env.API_AUTH_PASSWORD || 'password'

  try {
    // Authentification basique
    const auth = Buffer.from(`${KIRBY_USERNAME}:${KIRBY_PASSWORD}`).toString('base64')
    const fetchUrl = `${KIRBY_URL}/api/query`

    console.log('Fetching:', fetchUrl)

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Erreur Kirby: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return await response.json()

  } catch (error: any) {
    // En mode build/prerender, retourner des données vides au lieu d'échouer
    if (process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'static') {
      console.warn('CMS non disponible lors du build, retour de données vides')
      return { result: null, status: 'offline' }
    }

    console.error('Erreur API Kirby:', error)
    console.error('Cause:', error?.cause)
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur de connexion au CMS: ${error instanceof Error ? error.message : 'Erreur inconnue'} - Cause: ${error?.cause?.code || error?.cause?.message || 'unknown'}`
    })
  }
})
