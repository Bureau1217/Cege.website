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

      <!-- Navigation à droite -->
      <button
        class="header-burger"
        type="button"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-controls="header-menu"
        :aria-label="isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        :class="{ 'is-open': isMenuOpen }"
        @click="isMenuOpen = !isMenuOpen"
      >
        <span class="sr-only">Menu</span>
        <span class="burger-line" />
        <span class="burger-line" />
        <span class="burger-line" />
      </button>

      <nav class="header-nav" :class="{ 'is-open': isMenuOpen }" id="header-menu">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.to" class="nav-item">
            <NuxtLink
              :to="item.to"
              class="nav-link"
              @click="isMenuOpen = false"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <div v-if="footerData" class="mobile-menu-footer">
          <div class="mobile-footer-contact">
            <div class="mobile-footer-item" v-if="footerData.adresse">
              <span
                v-if="footerIcons.adresse?.url"
                class="mobile-footer-icon"
                :style="getIconStyle(footerIcons.adresse.url)"
                aria-hidden="true"
              />
              <div class="mobile-footer-text" v-html="footerData.adresse" />
            </div>

            <div class="mobile-footer-item" v-if="footerData.telephone">
              <span
                v-if="footerIcons.telephone?.url"
                class="mobile-footer-icon"
                :style="getIconStyle(footerIcons.telephone.url)"
                aria-hidden="true"
              />
              <div class="mobile-footer-text">
                <a :href="`tel:${footerData.telephone}`">{{ footerData.telephone }}</a>
              </div>
            </div>

            <div class="mobile-footer-item" v-if="footerData.email">
              <span
                v-if="footerIcons.email?.url"
                class="mobile-footer-icon"
                :style="getIconStyle(footerIcons.email.url)"
                aria-hidden="true"
              />
              <div class="mobile-footer-text">
                <a :href="`mailto:${footerData.email}`">{{ footerData.email }}</a>
              </div>
            </div>

            <div class="mobile-footer-item" v-if="footerData.horaires">
              <span
                v-if="footerIcons.horaires?.url"
                class="mobile-footer-icon"
                :style="getIconStyle(footerIcons.horaires.url)"
                aria-hidden="true"
              />
              <div class="mobile-footer-text" v-html="footerData.horaires" />
            </div>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'

const { data } = await useFetch<any>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: 'site',
    select: {
      site: {
        menu_logo: 'site.menu_logo.value',
        files: {
          query: 'site.files',
          select: {
            uuid: 'file.uuid',
            url: 'file.url',
            alt: 'file.alt.value',
            extension: 'file.extension'
          }
        }
      },
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

const siteFiles = computed(() => siteData.value?.files || [])
const footerData = computed(() => {
  if (data.value && data.value.status === 'ok') {
    return data.value.result.footer
  }
  return null
})
const footerFiles = computed(() => footerData.value?.files || [])
const allFiles = computed(() => [...siteFiles.value, ...footerFiles.value])
const { getCmsImageUrl } = useCmsImage(allFiles)

const siteData = computed(() => {
  if (data.value && data.value.status === 'ok') {
    return data.value.result.site
  }
  return null
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

const logoSvg = ref<string | null>(null)

const applyLogoColors = (svg: string) => {
  const hasKnownColors = /#9eb2fb|#1de7a9|#16009d/i.test(svg)
  if (hasKnownColors) {
    return svg
      .replace(/#9eb2fb/gi, 'var(--color-secondary)')
      .replace(/#1de7a9/gi, 'var(--color-accent)')
      .replace(/#16009d/gi, 'var(--color-primary)')
  }

  let pathIndex = 0
  return svg.replace(/<path\b([^>]*?)(\/?)>/gi, (match, attrs, selfClose) => {
    if (/fill\s*=/.test(attrs)) return match
    pathIndex += 1
    const fill = pathIndex === 1
      ? 'var(--color-secondary)'
      : pathIndex === 2
        ? 'var(--color-accent)'
        : 'var(--color-primary)'
    const close = selfClose ? '/>' : '>'
    return `<path${attrs} fill="${fill}"${close}`
  })
}

const loadLogoSvg = async () => {
  logoSvg.value = null
  const logo = logoImage.value
  if (!logo?.url) return
  const extension = logo.extension || ''
  const isSvg = extension.toLowerCase() === 'svg' || logo.url.toLowerCase().includes('.svg')
  if (!isSvg) return

  try {
    const resolved = getCmsImageUrl(logo.url)
    const response = await fetch(resolved)
    if (!response.ok) return
    const rawSvg = await response.text()
    logoSvg.value = applyLogoColors(rawSvg)
  } catch {
    logoSvg.value = null
  }
}

watch(logoImage, () => {
  if (process.client) {
    loadLogoSvg()
  }
}, { immediate: true })

const navItems = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Nos Services' },
  { to: '/contact', label: 'Nous Contacter' }
]

const isMenuOpen = ref(false)

const footerIcons = computed(() => {
  const current = footerData.value
  return {
    adresse: resolveFooterIcon(current?.icone_adresse),
    telephone: resolveFooterIcon(current?.icone_telephone),
    email: resolveFooterIcon(current?.icone_email),
    horaires: resolveFooterIcon(current?.icone_horaires)
  }
})
</script>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #f5f5f5;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: calc(100% - (var(--page-gutter) * 2));
  margin: 0 auto;
  padding: var(--space-l) var(--page-gutter);
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
  height: 40px;
  width: auto;
  display: block;
  border-radius: 0;
}

.logo-svg :deep(svg) {
  height: 40px;
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

.header-burger {
  display: none;
  border: 0;
  background: transparent;
  padding: var(--space-xs);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  z-index: 200;
}

.burger-line {
  display: block;
  width: 26px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 999px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.header-burger.is-open .burger-line {
  background: #fff;
}

.header-burger.is-open .burger-line:nth-child(2) {
  transform: translateY(7px) rotate(45deg);
}

.header-burger.is-open .burger-line:nth-child(3) {
  opacity: 0;
}

.header-burger.is-open .burger-line:nth-child(4) {
  transform: translateY(-7px) rotate(-45deg);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.mobile-menu-footer {
  display: none;
}

.mobile-footer-contact {
  display: grid;
  gap: var(--space-m);
}

.mobile-footer-item {
  display: flex;
  gap: var(--space-s);
  align-items: flex-start;
  padding: var(--space-m);
  border-radius: var(--radius-m);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
}

.mobile-footer-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background-color: var(--color-accent);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.mobile-footer-text {
  font-size: var(--text-small-size);
  line-height: 1.5;
  color: inherit;
  overflow-wrap: anywhere;
  word-break: break-word;

  a {
    color: inherit;
    text-decoration: none;
  }
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
    padding: var(--space-m) var(--page-gutter-mobile);
    flex-wrap: wrap;
  }

  .header-burger {
    display: inline-flex;
    margin-left: auto;
  }

  .header-nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    display: none;
    position: fixed;
    inset: 0;
    background: var(--color-primary);
    padding: var(--space-xxl) var(--space-xl) var(--space-xl);
    z-index: 150;
    align-items: flex-start;
    flex-direction: column;
    overflow-y: auto;
    height: 100%;
  }

  .header-nav.is-open {
    display: flex;
  }

  .nav-list {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-m);
    width: 100%;
  }

  .nav-link {
    font-size: 2.5rem;
    padding: var(--space-s) 0;
    color: white;

    &::after {
      background: white;
    }
  }

  .mobile-menu-footer {
    display: flex;
    flex-direction: column;
    gap: var(--space-l);
    margin-top: auto;
    padding-top: var(--space-xl);
    width: 100%;
  }

  .logo {
    font-size: 1.25rem;
  }

  .logo-image {
    height: 34px;
  }

  .logo-svg :deep(svg) {
    height: 34px;
  }
}

@media (max-width: 480px) {
  .header-inner {
    padding: var(--space-m) var(--space-s);
  }

  .nav-list {
    gap: var(--space-xs);
  }

  .nav-link {
    font-size: 2rem;
    padding: var(--space-s) 0;
    color: white;

    &::after {
      background: white;
    }
  }

  .logo-image {
    height: 30px;
  }

  .logo-svg :deep(svg) {
    height: 30px;
  }
}
</style>
