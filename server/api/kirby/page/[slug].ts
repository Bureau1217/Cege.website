export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const runtimeConfig = useRuntimeConfig()
  const envUrl = process.env.API_URL
  const cmsUrl = envUrl || runtimeConfig.public.kirbyUrl || 'http://localhost:8000'

  if (!slug) {
    setResponseStatus(event, 400)
    return { status: 'error', message: 'Missing slug' }
  }

  try {
    const base = cmsUrl.replace(/\/$/, '')
    const apiBase = base.endsWith('/api') ? base : `${base}/api`
    const response = await fetch(`${apiBase}/pages/${encodeURIComponent(slug)}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return { status: 'ok', result: data }
  } catch (error) {
    console.error('Error fetching page from Kirby:', error)
    setResponseStatus(event, 500)
    return {
      status: 'error',
      message: 'Failed to fetch page from CMS'
    }
  }
})
