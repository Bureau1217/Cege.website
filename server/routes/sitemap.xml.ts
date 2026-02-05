export default defineEventHandler((event) => {
  const siteUrl = 'https://cegeswiss.com'
  const now = new Date().toISOString().split('T')[0]

  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/services', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.7', changefreq: 'monthly' },
    { url: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
  ]

  const urls = pages.map(page => `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

  setResponseHeader(event, 'content-type', 'application/xml')
  return sitemap
})
