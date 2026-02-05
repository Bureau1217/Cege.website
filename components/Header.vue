<template>
  <header class="header">
    <div class="header-inner">
      <!-- Logo/Texte à gauche -->
      <div class="header-left">
        <NuxtLink to="/" class="logo">
          <span
            v-if="logoSvg"
            class="logo-image logo-svg"
            role="img"
            :aria-label="logoImage?.alt || 'CEGE'"
            v-html="logoSvg"
          />
          <img
            v-else-if="logoImage?.url"
            :src="getCmsImageUrl(logoImage.url)"
            :alt="logoImage.alt || 'CEGE'"
            class="logo-image"
          />
          <span v-else class="logo-text">CEGE</span>
        </NuxtLink>
      </div>

      <!-- Navigation desktop -->
      <nav class="header-nav">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.to" class="nav-item">
            <NuxtLink :to="item.to" class="nav-link">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- Bouton hamburger mobile -->
      <MobileMenuToggle />
    </div>

    <!-- Menu mobile (s'affiche en dessous du header) -->
    <MobileMenu
      :items="navItems"
      :footer-data="footerData"
      :footer-icons="footerIcons"
      :get-icon-style="getIconStyle"
    />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'
import MobileMenu from '@/components/MobileMenu.vue'
import MobileMenuToggle from '@/components/MobileMenuToggle.vue'

const { siteData: siteSettings } = await useSiteSettings()

const { data: footerResponse } = await useFetch<any>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: 'site',
    select: {
      footer: {
        query: "site.find('footer')",
        select: {
          adresse: 'page.adresse.value',
          telephone: 'page.telephone.value',
          email: 'page.email.value',
          horaires: 'page.horaires.value',
          icone_adresse: 'page.icone_adresse.value',
          icone_telephone: 'page.icone_telephone.value',
          icone_email: 'page.icone_email.value',
          icone_horaires: 'page.icone_horaires.value',
          files: {
            query: 'page.files',
            select: {
              uuid: 'file.uuid',
              url: 'file.url',
              alt: 'file.alt.value'
            }
          }
        }
      }
    }
  }
})

const siteData = computed(() => {
  if (siteSettings.value && siteSettings.value.status === 'ok') {
    return siteSettings.value.result
  }
  return null
})

const footerData = computed(() => {
  if (footerResponse.value && footerResponse.value.status === 'ok') {
    return footerResponse.value.result.footer
  }
  return null
})

const siteFiles = computed(() => siteData.value?.files || [])
const footerFiles = computed(() => footerData.value?.files || [])
const allFiles = computed(() => [...siteFiles.value, ...footerFiles.value])
const { getCmsImageUrl } = useCmsImage(allFiles)

const siteFilesByUuid = computed(() => {
  const files = siteData.value?.files || []
  const map: Record<string, any> = {}
  files.forEach((file: any) => {
    if (file?.uuid) {
      map[file.uuid] = file
      map[`file://${file.uuid}`] = file
    }
  })
  return map
})

const footerFilesByUuid = computed(() => {
  const files = footerData.value?.files || []
  const map: Record<string, any> = {}
  files.forEach((file: any) => {
    if (file?.uuid) {
      map[file.uuid] = file
      map[`file://${file.uuid}`] = file
    }
  })
  return map
})

const extractFileRef = (value: string) => {
  const match = value.match(/file:\/\/[a-z0-9]+/i)
  if (match) return match[0]
  return value.trim()
}

const resolveLogo = (fieldValue: any) => {
  if (!fieldValue) return null
  if (Array.isArray(fieldValue)) {
    return resolveLogo(fieldValue[0])
  }
  if (typeof fieldValue === 'object') {
    if (fieldValue.url) {
      return { url: fieldValue.url, alt: fieldValue.alt || '', extension: fieldValue.extension }
    }
    if (fieldValue.uuid) {
      fieldValue = `file://${fieldValue.uuid}`
    }
  }
  if (typeof fieldValue !== 'string') return null

  const normalized = extractFileRef(fieldValue)
  const file = siteFilesByUuid.value[normalized] || siteFilesByUuid.value[normalized.replace('file://', '')]
  if (file) {
    return { url: file.url, alt: file.alt || '', extension: file.extension }
  }

  // Si le fichier n'est pas trouvé, utiliser le proxy API
  const uuidMatch = normalized.match(/file:\/\/([a-z0-9]+)/i)
  if (uuidMatch) {
    return { url: `/api/file/${uuidMatch[1]}`, alt: '', extension: 'svg' }
  }

  return { url: normalized, alt: '', extension: undefined }
}

const resolveFooterIcon = (fieldValue: any) => {
  if (!fieldValue) return null
  if (Array.isArray(fieldValue)) {
    return resolveFooterIcon(fieldValue[0])
  }
  if (typeof fieldValue === 'object') {
    if (fieldValue.url) {
      return { url: fieldValue.url, alt: fieldValue.alt || '' }
    }
    if (fieldValue.uuid) {
      fieldValue = `file://${fieldValue.uuid}`
    }
  }
  if (typeof fieldValue !== 'string') return null

  const normalized = extractFileRef(fieldValue)
  const file = footerFilesByUuid.value[normalized] || footerFilesByUuid.value[normalized.replace('file://', '')]
  if (file) {
    return { url: file.url, alt: file.alt || '' }
  }

  return { url: normalized, alt: '' }
}

const getIconStyle = (url: string) => {
  const resolved = getCmsImageUrl(url)
  return {
    maskImage: `url(${resolved})`,
    WebkitMaskImage: `url(${resolved})`
  }
}

const logoImage = computed(() => resolveLogo(siteData.value?.menu_logo))

const applyLogoColors = (svg: string) => {
  const hasKnownColors = /#9eb2fb|#1de7a9|#16009d|#3b75db|#c64949|#45b76f/i.test(svg)
  if (hasKnownColors) {
    return svg
      .replace(/#9eb2fb/gi, 'var(--color-secondary)')
      .replace(/#1de7a9/gi, 'var(--color-accent)')
      .replace(/#16009d/gi, 'var(--color-primary)')
      .replace(/#3b75db/gi, 'var(--color-primary)')
      .replace(/#c64949/gi, 'var(--color-secondary)')
      .replace(/#45b76f/gi, 'var(--color-accent)')
  }

  // Count total paths to identify icon vs text paths
  const allPaths = svg.match(/<path\b[^>]*>/gi) || []
  const totalPaths = allPaths.length

  let pathIndex = 0
  return svg.replace(/<path\b([^>]*?)(\/?)>/gi, (match, attrs, selfClose) => {
    pathIndex += 1
    const close = selfClose ? '/>' : '>'
    // Icon paths (last 3): apply site colors
    const iconStart = totalPaths - 2
    if (pathIndex === iconStart) {
      const cleaned = attrs.replace(/fill\s*=\s*"[^"]*"/gi, '')
      return `<path${cleaned} fill="var(--color-primary)"${close}`
    }
    if (pathIndex === iconStart + 1) {
      const cleaned = attrs.replace(/fill\s*=\s*"[^"]*"/gi, '')
      return `<path${cleaned} fill="var(--color-secondary)"${close}`
    }
    if (pathIndex === iconStart + 2) {
      const cleaned = attrs.replace(/fill\s*=\s*"[^"]*"/gi, '')
      return `<path${cleaned} fill="var(--color-accent)"${close}`
    }
    // Text paths: apply primary color
    if (/fill\s*=/.test(attrs)) {
      const cleaned = attrs.replace(/fill\s*=\s*"[^"]*"/gi, '')
      return `<path${cleaned} fill="var(--color-primary)"${close}`
    }
    return `<path${attrs} fill="var(--color-primary)"${close}`
  })
}

// Charger le SVG côté serveur pour éviter le délai
const getLogoDirectUrl = () => {
  const logo = logoImage.value
  if (!logo?.url) return null
  const extension = logo.extension || ''
  const url = logo.url || ''
  const looksSvg = extension.toLowerCase() === 'svg' || url.toLowerCase().includes('.svg')
  const shouldProbe = looksSvg || url.startsWith('file://')
  if (!shouldProbe) return null
  // Retourner l'URL directe du CMS (pas le proxy) pour le fetch SSR
  return url
}

const { data: logoSvg } = await useAsyncData('logo-svg', async () => {
  const url = getLogoDirectUrl()
  if (!url) return null
  try {
    // Fetch directement depuis le CMS (fonctionne côté serveur)
    const response = await $fetch<string>(url, { responseType: 'text' })
    if (typeof response === 'string' && response.includes('<svg')) {
      return applyLogoColors(response)
    }
  } catch {
    // Ignore errors
  }
  return null
})

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Nos Services' },
  { to: '/contact', label: 'Nous Contacter' }
]


const footerIcons = computed(() => ({
  adresse: resolveFooterIcon(footerData.value?.icone_adresse),
  telephone: resolveFooterIcon(footerData.value?.icone_telephone),
  email: resolveFooterIcon(footerData.value?.icone_email),
  horaires: resolveFooterIcon(footerData.value?.icone_horaires)
}))
</script>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #f5f5f5;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-l) calc(var(--page-gutter) * 2);
}

.header-left {
  flex-shrink: 0;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-primary);
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
}

.logo-image {
  height: 30px;
  width: auto;
  display: block;
  border-radius: 0;
}

.logo-svg :deep(svg) {
  height: 30px;
  width: auto;
  display: block;
}

.logo-text {
  display: inline-block;
}

.header-nav {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.nav-list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-xl);
}

.nav-item {
  display: inline-block;
}

.nav-link {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-s);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--color-primary);
    transition: width 0.3s ease;
  }

  &:hover {
    color: var(--color-primary);

    &::after {
      width: 100%;
    }
  }

  &:active {
    transform: scale(0.98);
  }
}

@media (max-width: 1024px) {
  .nav-list {
    gap: var(--space-l);
  }

  .nav-link {
    font-size: 1.05rem;
    padding: var(--space-xs) var(--space-m);
  }
}

@media (max-width: 768px) {
  .header-inner {
    padding: var(--space-m) calc(var(--page-gutter-mobile) * 2);
    flex-wrap: wrap;
  }

  .header-nav {
    display: none;
  }

  .nav-list {
    gap: var(--space-m);
  }

  .nav-link {
    padding: var(--space-s) var(--space-m);

    &::after {
      background: var(--color-primary);
    }
  }

  .logo {
    font-size: 1.25rem;
  }

  .logo-image {
    height: 26px;
  }

  .logo-svg :deep(svg) {
    height: 26px;
  }
}

@media (max-width: 480px) {
  .header-inner {
    padding: var(--space-m) calc(var(--page-gutter-mobile) * 2);
  }

  .nav-list {
    gap: var(--space-xs);
  }

  .nav-link {
    font-size: 1.05rem;
    padding: var(--space-s) var(--space-m);
  }

  .logo-image {
    height: 22px;
  }

  .logo-svg :deep(svg) {
    height: 22px;
  }
}
</style>
