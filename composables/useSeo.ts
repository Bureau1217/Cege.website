import { computed, unref } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'

type SeoData = {
  metaTitle?: string
  metaDescription?: string
  metaTemplate?: string
  useTitleTemplate?: boolean | string
  ogTemplate?: string
  useOgTemplate?: boolean | string
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
}

const pickValue = (...values: Array<unknown>) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }
  }
  return ''
}

const normalizeBool = (value: unknown) => value === true || value === 'true'

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
  const files = computed(() => unref(options.files) || [])
  const { getCmsImageUrl } = useCmsImage(files)

  const page = computed(() => (unref(options.page) || {}) as SeoData)
  const site = computed(() => (unref(options.site) || {}) as SeoData & { title?: string })
  const pageTitle = computed(() => pickValue(unref(options.title)))

  const resolvedTitle = computed(() => {
    const baseTitle = pickValue(page.value.metaTitle, pageTitle.value, site.value.title || '')
    const templateSource = normalizeBool(page.value.useTitleTemplate)
      ? pickValue(page.value.metaTemplate, site.value.metaTemplate)
      : ''
    const template = templateSource || ''
    if (!template) return baseTitle
    return applyTemplate(template, baseTitle, site.value.title || '')
  })

  const resolvedDescription = computed(() => {
    return pickValue(page.value.metaDescription, site.value.metaDescription)
  })

  const resolvedOgTitle = computed(() => {
    const baseTitle = pickValue(page.value.metaTitle, pageTitle.value, site.value.title || '')
    const templateSource = normalizeBool(page.value.useOgTemplate)
      ? pickValue(page.value.ogTemplate, site.value.ogTemplate)
      : ''
    const template = templateSource || ''
    if (!template) return resolvedTitle.value
    return applyTemplate(template, baseTitle, site.value.title || '')
  })

  const resolvedOgDescription = computed(() => {
    return pickValue(page.value.ogDescription, page.value.metaDescription, site.value.ogDescription, site.value.metaDescription)
  })

  const resolvedOgImage = computed(() => {
    const ref = pickValue(
      normalizeImageRef(page.value.ogImage),
      normalizeImageRef(site.value.ogImage)
    )
    if (!ref) return ''
    return getCmsImageUrl(ref)
  })

  const resolvedTwitterCard = computed(() => {
    return pickValue(page.value.twitterCardType, site.value.twitterCardType)
  })

  const resolvedTwitterAuthor = computed(() => {
    return pickValue(page.value.twitterAuthor, site.value.twitterAuthor)
  })

  useHead(() => {
    const meta: Array<Record<string, string>> = []
    if (resolvedDescription.value) {
      meta.push({ name: 'description', content: resolvedDescription.value })
    }
    if (resolvedOgTitle.value) {
      meta.push({ property: 'og:title', content: resolvedOgTitle.value })
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
    if (resolvedOgTitle.value) {
      meta.push({ name: 'twitter:title', content: resolvedOgTitle.value })
    }
    if (resolvedOgDescription.value) {
      meta.push({ name: 'twitter:description', content: resolvedOgDescription.value })
    }
    if (resolvedOgImage.value) {
      meta.push({ name: 'twitter:image', content: resolvedOgImage.value })
    }

    return {
      title: resolvedTitle.value || undefined,
      meta
    }
  })
}
