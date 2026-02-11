import { computed, unref } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'
import { useRoute, useRuntimeConfig } from '#imports'

type SeoData = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: string | string[]
}

type SiteSeoData = {
  title?: string
  metaTemplate?: string
  metaDescription?: string
  ogDescription?: string
  ogImage?: string | string[]
  twitterCardType?: string
  twitterAuthor?: string
}

type SeoOptions = {
  page: any
  site: any
  title: any
  files?: any
  canonicalPath?: string
}

const pickValue = (...values: Array<unknown>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return ''
}

const applyTemplate = (template: string, title: string, siteTitle: string) => {
  return template
    .replace(/\{\{\s*title\s*\}\}/gi, title)
    .replace(/\{\{\s*page\.title\s*\}\}/gi, title)
    .replace(/\{\{\s*site\.title\s*\}\}/gi, siteTitle)
}

const normalizeImageRef = (value: unknown) => {
  if (Array.isArray(value)) return value[0] || ''
  if (typeof value === 'string') return value
  return ''
}

export const useSeo = (options: SeoOptions) => {
  const route = useRoute()
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string

  const files = computed(() => unref(options.files) || [])
  const { getCmsImageUrl } = useCmsImage(files)

  const canonicalUrl = computed(() => {
    const path = options.canonicalPath || route.path
    const cleanPath = path === '/' ? '' : path.replace(/\/$/, '')
    return `${siteUrl}${cleanPath}`
  })

  const page = computed(() => (unref(options.page) || {}) as SeoData)
  const site = computed(() => (unref(options.site) || {}) as SiteSeoData)
  const pageTitle = computed(() => pickValue(unref(options.title)))

  // Titre : page.metaTitle > page.title > site.title, puis on applique le template site
  const resolvedTitle = computed(() => {
    const baseTitle = pickValue(page.value.metaTitle, pageTitle.value, site.value.title || '')
    const template = pickValue(site.value.metaTemplate)
    if (!template) return baseTitle
    return applyTemplate(template, baseTitle, site.value.title || '')
  })

  // Description : page > site
  const resolvedDescription = computed(() => {
    return pickValue(page.value.metaDescription, site.value.metaDescription)
  })

  // OG description : page.metaDescription > site.ogDescription > site.metaDescription
  const resolvedOgDescription = computed(() => {
    return pickValue(page.value.metaDescription, site.value.ogDescription, site.value.metaDescription)
  })

  // OG image : page > site
  const resolvedOgImage = computed(() => {
    const ref = pickValue(
      normalizeImageRef(page.value.ogImage),
      normalizeImageRef(site.value.ogImage)
    )
    if (!ref) return ''
    return getCmsImageUrl(ref)
  })

  // Twitter : site-level uniquement
  const resolvedTwitterCard = computed(() => {
    return pickValue(site.value.twitterCardType)
  })

  const resolvedTwitterAuthor = computed(() => {
    return pickValue(site.value.twitterAuthor)
  })

  useHead(() => {
    const meta: Array<Record<string, string>> = []
    const link: Array<Record<string, string>> = []

    // Canonical URL
    link.push({ rel: 'canonical', href: canonicalUrl.value })

    // Open Graph URL
    meta.push({ property: 'og:url', content: canonicalUrl.value })

    if (resolvedDescription.value) {
      meta.push({ name: 'description', content: resolvedDescription.value })
    }
    if (resolvedTitle.value) {
      meta.push({ property: 'og:title', content: resolvedTitle.value })
    }
    if (resolvedOgDescription.value) {
      meta.push({ property: 'og:description', content: resolvedOgDescription.value })
    }
    if (resolvedOgImage.value) {
      meta.push({ property: 'og:image', content: resolvedOgImage.value })
    }
    if (resolvedTwitterCard.value) {
      meta.push({ name: 'twitter:card', content: resolvedTwitterCard.value })
    }
    if (resolvedTwitterAuthor.value) {
      meta.push({ name: 'twitter:creator', content: resolvedTwitterAuthor.value })
    }
    if (resolvedTitle.value) {
      meta.push({ name: 'twitter:title', content: resolvedTitle.value })
    }
    if (resolvedOgDescription.value) {
      meta.push({ name: 'twitter:description', content: resolvedOgDescription.value })
    }
    if (resolvedOgImage.value) {
      meta.push({ name: 'twitter:image', content: resolvedOgImage.value })
    }

    return {
      title: resolvedTitle.value || undefined,
      meta,
      link
    }
  })
}
