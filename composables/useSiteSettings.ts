import { watch } from 'vue'

export const useSiteSettings = () => {
  const { data: siteData } = useFetch<any>('/api/CMS_KQLRequest', {
    method: 'POST',
    body: {
      query: 'site',
      select: {
        colorPrimary: 'site.colorPrimary.value',
        colorSecondary: 'site.colorSecondary.value',
        colorAccent: 'site.colorAccent.value',
        colorBackground: 'site.colorBackground.value',
        cookieBannerEnabled: 'site.cookieBannerEnabled.value',
        cookieBannerText: 'site.cookieBannerText.value',
        cookieBannerAcceptLabel: 'site.cookieBannerAcceptLabel.value',
        cookieBannerDeclineLabel: 'site.cookieBannerDeclineLabel.value',
        cookieBannerLinkLabel: 'site.cookieBannerLinkLabel.value',
        cookieBannerLinkUrl: 'site.cookieBannerLinkUrl.value'
      }
    }
  })

  // Apply colors as CSS variables (client-side only)
  const applyColors = () => {
    if (typeof window === 'undefined') return
    if (!siteData.value?.result) return

    const result = siteData.value.result
    const root = document.documentElement

    // Set CSS variables from CMS data
    if (result.colorPrimary) root.style.setProperty('--color-primary', result.colorPrimary)
    if (result.colorSecondary) root.style.setProperty('--color-secondary', result.colorSecondary)
    if (result.colorAccent) root.style.setProperty('--color-accent', result.colorAccent)
    root.style.setProperty('--color-neutral', '#ffffff')
    root.style.setProperty('--color-dark', '#000000')
    if (result.colorBackground) {
      root.style.setProperty('--color-background', result.colorBackground)
      document.body.style.backgroundColor = result.colorBackground
    }
  }

  // Watch for changes and apply (client-side only)
  if (process.client) {
    watch(siteData, () => {
      applyColors()
    }, { immediate: true })
  }

  return {
    siteData
  }
}
