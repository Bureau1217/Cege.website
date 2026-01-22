export default defineEventHandler(async (event) => {
  const uuid = getRouterParam(event, 'uuid')
  if (!uuid) {
    setResponseStatus(event, 400)
    return { error: 'Missing UUID' }
  }

  const config = useRuntimeConfig()
  const apiUrl = config.apiUrl || 'http://localhost:8000'
  const email = config.apiAuthEmail
  const password = config.apiAuthPassword

  try {
    // Récupérer l'URL du fichier via KQL
    const kqlResponse = await $fetch<any>(`${apiUrl}/api/query`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${email}:${password}`).toString('base64'),
        'Content-Type': 'application/json'
      },
      body: {
        query: 'site',
        select: {
          file: {
            query: `site.index.files.find("file://${uuid}")`,
            select: {
              url: 'file.url'
            }
          }
        }
      }
    })

    const fileUrl = kqlResponse?.result?.file?.url

    if (!fileUrl) {
      setResponseStatus(event, 404)
      return { error: 'File not found' }
    }

    // Récupérer le fichier depuis le CMS
    const response = await fetch(fileUrl)

    if (!response.ok) {
      setResponseStatus(event, response.status)
      return { error: 'Failed to fetch file' }
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')

    return buffer
  } catch (error) {
    console.error('[file-proxy] Failed to resolve uuid', uuid, error)
    setResponseStatus(event, 500)
    return { error: 'Failed to resolve file' }
  }
})
