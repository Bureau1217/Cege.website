export default defineEventHandler(async (event) => {
  const siteUrl = process.env.SITE_URL || 'https://cegeswiss.com'
  const apiUrl = process.env.API_URL
  const email = process.env.API_AUTH_EMAIL
  const password = process.env.API_AUTH_PASSWORD

  // Default pages with SEO priorities
  const defaultPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly', slug: 'home' },
    { url: '/services', priority: '0.8', changefreq: 'monthly', slug: 'services' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly', slug: 'contact' },
    { url: '/mentions-legales', priority: '0.3', changefreq: 'yearly', slug: 'mentions-legales' },
  ]

  let pagesWithDates = defaultPages.map(page => ({
    ...page,
    lastmod: new Date().toISOString().split('T')[0]
  }))

  // Try to fetch last modified dates from CMS
  if (apiUrl && email && password) {
    try {
      const authHeader = Buffer.from(`${email}:${password}`).toString('base64')
      const response = await $fetch<{ result?: any[] }>(`${apiUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        },
        body: {
          query: 'page.children.listed',
          select: {
            slug: true,
            modified: 'page.modified("Y-m-d")'
          }
        }
      })

      if (response?.result) {
        const cmsPages = response.result as Array<{ slug: string; modified: string }>
        pagesWithDates = defaultPages.map(page => {
          const cmsPage = cmsPages.find(p => p.slug === page.slug)
          return {
            ...page,
            lastmod: cmsPage?.modified || new Date().toISOString().split('T')[0]
          }
        })
      }
    } catch (error) {
      console.warn('Sitemap: Could not fetch CMS dates, using current date')
    }
  }

  const urls = pagesWithDates.map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml')
  setResponseHeader(event, 'cache-control', 'public, max-age=3600')
  return sitemap
})
