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
      <nav class="header-nav">
        <ul class="nav-list">
          <li v-for="item in navItems" :key="item.to" class="nav-item">
            <NuxtLink
              :to="item.to"
              class="nav-link"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
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
      home: {
        query: "site.find('home')",
        select: {
          menu_logo: 'page.menu_logo.value',
          files: {
            query: 'page.files',
            select: {
              uuid: 'file.uuid',
              url: 'file.url',
              alt: 'file.alt.value',
              extension: 'file.extension'
            }
          }
        }
      }
    }
  }
})

const { getCmsImageUrl } = useCmsImage()

const homeData = computed(() => {
  if (data.value && data.value.status === 'ok') {
    return data.value.result.home
  }
  return null
})

const homeFilesByUuid = computed(() => {
  const files = homeData.value?.files || []
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

const normalizeFileUuid = (value: string) => value.replace(/^file:\/\//, '')

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
  const file = homeFilesByUuid.value[normalized] || homeFilesByUuid.value[normalized.replace('file://', '')]
  if (file) {
    const fileUuid = typeof file.uuid === 'string' ? normalizeFileUuid(file.uuid) : file.uuid
    return { url: `file://${fileUuid}`, alt: file.alt || '', extension: file.extension }
  }

  return { url: normalized, alt: '', extension: undefined }
}

const logoImage = computed(() => resolveLogo(homeData.value?.menu_logo))

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
  }

  .nav-list {
    gap: var(--space-m);
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .nav-link {
    font-size: 1rem;
    padding: var(--space-xs) var(--space-s);
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
    flex-direction: column;
    gap: var(--space-m);
  }

  .header-nav {
    width: 100%;
    justify-content: center;
  }

  .nav-list {
    gap: var(--space-s);
    justify-content: center;
  }

  .nav-link {
    font-size: 0.95rem;
    padding: var(--space-xs) var(--space-s);
  }

  .logo-image {
    height: 30px;
  }

  .logo-svg :deep(svg) {
    height: 30px;
  }
}
</style>
