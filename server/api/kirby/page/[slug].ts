export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const runtimeConfig = useRuntimeConfig()
  const cmsUrl = runtimeConfig.public.kirbyUrl || 'http://localhost:8000'

  try {
    // Fetch the page directly using the template URL
    const response = await fetch(`${cmsUrl}/${slug}`, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`)
    }

    const data = await response.json()
    return { result: data }
  } catch (error) {
    console.error('Error fetching page from Kirby:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch page from CMS',
    })
  }
})
