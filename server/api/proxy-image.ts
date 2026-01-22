export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const imageUrl = query.url as string

  if (!imageUrl) {
    throw createError({
      statusCode: 400,
      message: 'URL parameter is required'
    })
  }

  try {
    // Récupérer l'image depuis le CMS
    const response = await fetch(imageUrl)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        message: 'Failed to fetch image'
      })
    }

    // Récupérer le content-type
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // Récupérer l'image en buffer
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Définir les headers de réponse
    setResponseHeaders(event, {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable'
    })

    return buffer
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to proxy image'
    })
  }
})
