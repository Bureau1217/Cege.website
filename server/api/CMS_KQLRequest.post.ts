export default defineEventHandler(async (event) => {
  const email = process.env.API_AUTH_EMAIL
  const password = process.env.API_AUTH_PASSWORD
  const apiUrl = process.env.API_URL

  if (!apiUrl) {
    return {
      code: 500,
      status: 'error',
      message: 'API_URL is missing. Check Cege.website/.env.'
    }
  }
  if (!email || !password) {
    return {
      code: 500,
      status: 'error',
      message: 'API_AUTH_EMAIL or API_AUTH_PASSWORD is missing. Check Cege.website/.env.'
    }
  }

  const authHeader = Buffer.from(`${email}:${password}`).toString('base64')

  const body = await readBody(event)

  try {
    const dataApi = await $fetch(`${apiUrl}/api/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authHeader}`
      },
      body,
    })

    return dataApi
  } catch (error: any) {
    console.error('CMS_KQLRequest failed:', error)
    return {
      code: 500,
      status: 'error',
      message: error?.message || 'CMS request failed'
    }
  }
})
