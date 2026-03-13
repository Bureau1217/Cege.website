import { useRuntimeConfig } from '#imports'

type LocalBusinessOptions = {
  type?: string | string[]
  name: string
  description?: string
  telephone?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    postalCode?: string
    addressCountry?: string
    addressRegion?: string
  }
  geo?: {
    latitude?: number
    longitude?: number
  }
  areaServed?: Array<{
    type: string
    name: string
  }>
  services?: string[]
  openingHours?: string[]
  priceRange?: string
  image?: string
  logo?: string
  sameAs?: string[]
}

export const useSchemaOrg = () => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl as string

  const addLocalBusiness = (options: LocalBusinessOptions) => {
    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': options.type || 'LocalBusiness',
      '@id': `${siteUrl}/#organization`,
      name: options.name,
      url: siteUrl,
    }

    if (options.description) {
      schema.description = options.description
    }

    if (options.telephone) {
      schema.telephone = options.telephone
    }

    if (options.email) {
      schema.email = options.email
    }

    if (options.address) {
      schema.address = {
        '@type': 'PostalAddress',
        ...options.address,
      }
    }

    if (options.geo?.latitude && options.geo?.longitude) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: options.geo.latitude,
        longitude: options.geo.longitude,
      }
    }

    if (options.areaServed?.length) {
      schema.areaServed = options.areaServed.map(area => ({
        '@type': area.type,
        name: area.name,
      }))
    }

    if (options.services?.length) {
      schema.hasOfferCatalog = {
        '@type': 'OfferCatalog',
        name: 'Services de contrôle électrique',
        itemListElement: options.services.map(service => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: service,
          },
        })),
      }
    }

    if (options.openingHours?.length) {
      schema.openingHours = options.openingHours
    }

    if (options.priceRange) {
      schema.priceRange = options.priceRange
    }

    if (options.image) {
      schema.image = options.image
    }

    if (options.logo) {
      schema.logo = options.logo
    }

    if (options.sameAs?.length) {
      schema.sameAs = options.sameAs
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
        },
      ],
    })
  }

  const addWebSite = (name: string, description?: string) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      name,
      url: siteUrl,
      description: description || undefined,
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
        },
      ],
    })
  }

  const addBreadcrumbs = (items: Array<{ name: string; url: string }>) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
      })),
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
        },
      ],
    })
  }

  const addSiteNavigation = (items: Array<{ name: string; url: string; description?: string }>) => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${siteUrl}/#navigation`,
      name: 'Navigation principale',
      itemListElement: items.map((item, index) => ({
        '@type': 'SiteNavigationElement',
        position: index + 1,
        name: item.name,
        description: item.description || undefined,
        url: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
      })),
    }

    useHead({
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(schema),
        },
      ],
    })
  }

  return {
    addLocalBusiness,
    addWebSite,
    addBreadcrumbs,
    addSiteNavigation,
  }
}
