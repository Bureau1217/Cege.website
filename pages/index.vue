<template>
  <main class="v-index">
    <div class="debug-info" v-if="data && data.status !== 'ok'">
      <h2>API Status: {{ data?.status }}</h2>
      <p>{{ JSON.stringify(data, null, 2) }}</p>
    </div>

    <template v-if="data && data.status === 'ok' && data.result?.home">
      <!-- Hero Section -->
      <section v-if="data.result.home.hero_titre || heroImage" id="hero" class="hero-section">
        <div v-if="heroImage" class="hero-image-wrapper">
          <img :src="proxyImageUrl(heroImage.large?.url || heroImage.reg?.url || heroImage.url)" :alt="heroImage.alt || heroTitlePlain || ''" class="hero-image" />
        </div>
        <div class="hero-overlay" />
        <div class="hero-content">
          <div v-if="data.result.home.hero_titre" class="hero-title" v-html="data.result.home.hero_titre" />
        </div>
      </section>

      <!-- Notre Entreprise Section -->
      <section v-if="data.result.home.notreEntreprise_colonne_gauche || data.result.home.notreEntreprise_colonne_droite" :id="`notre-entreprise`" class="section-with-anchor">
        <SectionTwoColumns
          :titre="formatSectionTitle(data.result.home.notreEntreprise_titre, 'Notre Entreprise', data.result.home.notreEntreprise_titre_couleur, data.result.home.notreEntreprise_titre_taille)"
          :colonneGauche="data.result.home.notreEntreprise_colonne_gauche || []"
          :colonneDroite="data.result.home.notreEntreprise_colonne_droite || []"
          :images="data.result.home.images || []"
          sectionId="notre-entreprise"
        />
      </section>

      <!-- Nos Services Section -->
      <section v-if="data.result.services" id="nos-services" class="services-section">
        <div class="services-inner">
          <div class="services-title" v-html="formatSectionTitle(data.result.home.nosServices_titre, 'Nos Services', data.result.home.nosServices_titre_couleur, data.result.home.nosServices_titre_taille)" />
          <div class="services-cards">
            <a v-if="(data.result.services as any).nosServices_titre" href="/services#nos-services" class="service-card">
              <div class="service-card-image" v-if="nosServicesImage">
                <img :src="proxyImageUrl(nosServicesImage)" :alt="stripHtml((data.result.services as any).nosServices_titre)" />
              </div>
              <div
                class="service-card-title"
                :class="[`card-title-${serviceCardTitleSize}`, `card-color-${serviceCardTitleColor}`]"
                v-html="formatCardTitle((data.result.services as any).nosServices_titre)"
              />
            </a>
            <a v-if="(data.result.services as any).controleBornes_titre" href="/services#controle-bornes" class="service-card">
              <div class="service-card-image" v-if="controleBornesImage">
                <img :src="proxyImageUrl(controleBornesImage)" :alt="stripHtml((data.result.services as any).controleBornes_titre)" />
              </div>
              <div
                class="service-card-title"
                :class="[`card-title-${serviceCardTitleSize}`, `card-color-${serviceCardTitleColor}`]"
                v-html="formatCardTitle((data.result.services as any).controleBornes_titre)"
              />
            </a>
            <a v-if="(data.result.services as any).controlePhotovoltaique_titre" href="/services#controle-photovoltaique" class="service-card">
              <div class="service-card-image" v-if="controlePhotovoltaiqueImage">
                <img :src="proxyImageUrl(controlePhotovoltaiqueImage)" :alt="stripHtml((data.result.services as any).controlePhotovoltaique_titre)" />
              </div>
              <div
                class="service-card-title"
                :class="[`card-title-${serviceCardTitleSize}`, `card-color-${serviceCardTitleColor}`]"
                v-html="formatCardTitle((data.result.services as any).controlePhotovoltaique_titre)"
              />
            </a>
          </div>
        </div>
      </section>

      <!-- Avis Section -->
      <section v-if="data.result.home.avis_visible !== false && data.result.home.avis && data.result.home.avis.length > 0" :id="`avis`" class="section-with-anchor">
        <SectionAvis
          :titre="formatSectionTitle(data.result.home.avis_titre, 'Avis', data.result.home.avis_titre_couleur, data.result.home.avis_titre_taille)"
          :blocks="data.result.home.avis"
          :files="data.result.home.images || []"
        />
      </section>

      <!-- Image Section (disabled) -->

    </template>

    <!-- Loading State -->
    <template v-else-if="pending">
      <div class="loading-state"></div>
    </template>

    <!-- Error State -->
    <template v-else>
      <div class="error-state section container">
        <h1>Erreur de chargement</h1>
        <p>Impossible de charger le contenu depuis le CMS.</p>
        <p v-if="data">Status: {{ data.status }}</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
// Import Section Components
import SectionTwoColumns from '@/components/SectionTwoColumns.vue'
import SectionAvis from '@/components/SectionAvis.vue'

// Import Block Components (image section only)
import BlockImage from '@/components/BlockImage.vue'
import BlockSectionFullImage from '@/components/BlockSectionFullImage.vue'

type FetchData = CMS_API_Response & {
  result: {
    home: CMS_API_HomePage
    services: any
    siteSeo: any
  }
}

// Fetch data from CMS (simple KQL, same pattern as MSS AVOCATES)
const { data, pending } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: 'site',
    select: {
      siteSeo: {
        title: 'site.title',
        metaTemplate: 'site.metaTemplate.value',
        metaDescription: 'site.metaDescription.value',
        ogDescription: 'site.ogDescription.value',
        ogImage: 'site.ogImage.value',
        twitterCardType: 'site.twitterCardType.value',
        twitterAuthor: 'site.twitterAuthor.value',
        files: {
          query: 'site.files',
          select: {
            uuid: 'file.uuid',
            url: 'file.url',
            alt: 'file.alt.value'
          }
        }
      },
      home: {
        query: "site.find('home')",
        select: {
          title: true,
          slug: true,
          hero_titre: 'page.hero_titre.toBlocks.toHtml',
          hero_image: 'page.hero_image.value',
          seo: {
            metaTitle: 'page.metaTitle.value',
            metaDescription: 'page.metaDescription.value',
            ogImage: 'page.ogImage.value'
          },
          notreEntreprise_titre: 'page.notreEntreprise_titre.value',
          notreEntreprise_titre_couleur: 'page.notreEntreprise_titre_couleur.value',
          notreEntreprise_titre_taille: 'page.notreEntreprise_titre_taille.value',
          notreEntreprise_colonne_gauche: 'page.notreEntreprise_colonne_gauche.toBlocks.toArray',
          notreEntreprise_colonne_droite: 'page.notreEntreprise_colonne_droite.toBlocks.toArray',
          nosServices_titre: 'page.nosServices_titre.value',
          nosServices_titre_couleur: 'page.nosServices_titre_couleur.value',
          nosServices_titre_taille: 'page.nosServices_titre_taille.value',
          nosServices_cartes_taille: 'page.nosServices_cartes_taille.value',
          nosServices_cartes_couleur: 'page.nosServices_cartes_couleur.value',
          image: 'page.image.toBlocks.toArray',
          avis_visible: 'page.avis_visible.toBool',
          avis_titre: 'page.avis_titre.value',
          avis_titre_couleur: 'page.avis_titre_couleur.value',
          avis_titre_taille: 'page.avis_titre_taille.value',
          avis: 'page.avis.toBlocks.toArray',
          images: {
            query: 'page.files',
            select: {
              uuid: 'file.uuid',
              url: 'file.url',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              alt: 'file.alt.value'
            }
          }
        }
      },
      services: {
        query: "site.find('services')",
        select: {
          nosServices_titre: 'page.nosServices_titre.value',
          nosServices_colonne_gauche: 'page.nosServices_colonne_gauche.toBlocks.toArray',
          nosServices_colonne_droite: 'page.nosServices_colonne_droite.toBlocks.toArray',
          controleBornes_titre: 'page.controleBornes_titre.value',
          controleBornes_colonne_gauche: 'page.controleBornes_colonne_gauche.toBlocks.toArray',
          controleBornes_colonne_droite: 'page.controleBornes_colonne_droite.toBlocks.toArray',
          controlePhotovoltaique_titre: 'page.controlePhotovoltaique_titre.value',
          controlePhotovoltaique_colonne_gauche: 'page.controlePhotovoltaique_colonne_gauche.toBlocks.toArray',
          controlePhotovoltaique_colonne_droite: 'page.controlePhotovoltaique_colonne_droite.toBlocks.toArray',
          images: {
            query: 'page.files',
            select: {
              uuid: 'file.uuid',
              url: 'file.url'
            }
          }
        }
      }
    }
  }
})

// Map image section block types to components
const getImageBlockComponent = (type: string) => {
  const componentMap: Record<string, any> = {
    'image': BlockImage,
    'section-full-image': BlockSectionFullImage
  }
  return componentMap[type] || 'div'
}

const stripHtml = (value?: string) => {
  if (!value) return ''
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const getTitleColorClass = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `color-${color}`
  }
  return ''
}

const getTitleTag = (size?: string) => {
  if (size === 'h1' || size === 'h2' || size === 'h3' || size === 'h4') {
    return size
  }
  return 'h4'
}

const formatSectionTitle = (value?: string, fallback?: string, color?: string, size?: string) => {
  const text = (value || '').trim() || (fallback || '').trim()
  if (!text) return ''
  const tag = getTitleTag(size)
  const colorClass = getTitleColorClass(color)
  const classAttr = colorClass ? ` class="${colorClass}"` : ''
  return `<${tag}${classAttr}>${escapeHtml(text)}</${tag}>`
}

const formatCardTitle = (value?: string) => {
  const text = (value || '').trim()
  if (!text) return ''
  return `<h3>${escapeHtml(text)}</h3>`
}

const normalizeFileRef = (value: any) => {
  if (!value) return null
  const normalized = Array.isArray(value) ? value[0] : value
  if (!normalized || typeof normalized !== 'string') return null
  const match = normalized.match(/file:\/\/[a-z0-9]+/i)
  return match ? match[0] : normalized.trim()
}

const resolveImageFromUuid = (uuid: any, images: any[]) => {
  if (!uuid || !images) return null
  const normalized = normalizeFileRef(uuid)
  if (!normalized) return null

  return images.find((img: any) =>
    img.uuid === normalized ||
    img.uuid === normalized.replace('file://', '') ||
    `file://${img.uuid}` === normalized
  ) || null
}

// Extraire la première image d'une liste de blocs
const getFirstImageFromBlocks = (blocks: any[], images: any[]) => {
  if (!blocks || !images) return null

  // Chercher le premier bloc de type image
  const imageBlock = blocks.find((block: any) => block.type === 'image' && block.content?.image)
  if (!imageBlock) return null

  // Récupérer l'UUID de l'image
  const imageUuid = Array.isArray(imageBlock.content.image)
    ? imageBlock.content.image[0]
    : imageBlock.content.image

  if (!imageUuid) return null

  // Trouver l'URL correspondante
  const imageData = resolveImageFromUuid(imageUuid, images)

  return imageData?.url || null
}

const heroImage = computed(() => {
  const home = data.value?.result?.home as any
  if (!home) return null
  return resolveImageFromUuid(home.hero_image, home.images || [])
})

const siteSeo = computed(() => data.value?.result?.siteSeo ?? null)
const homeSeo = computed(() => (data.value?.result?.home as any)?.seo ?? null)
const seoFiles = computed(() => [
  ...((data.value?.result?.home as any)?.images || []),
  ...(siteSeo.value?.files || [])
])

useSeo({
  page: homeSeo,
  site: siteSeo,
  title: computed(() => (data.value?.result?.home as any)?.title || 'CEGE'),
  files: seoFiles
})

const heroTitlePlain = computed(() => {
  return stripHtml((data.value?.result?.home as any)?.hero_titre || '')
})

const serviceCardTitleSize = computed(() => {
  const size = (data.value?.result?.home as any)?.nosServices_cartes_taille
  if (size === 'small' || size === 'large') return size
  return 'medium'
})

const serviceCardTitleColor = computed(() => {
  const color = (data.value?.result?.home as any)?.nosServices_cartes_couleur
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return color
  }
  return 'neutral'
})

// Images des services
const nosServicesImage = computed(() => {
  if (!data.value?.result?.services) return null
  const services = data.value.result.services as any
  const allBlocks = [...(services.nosServices_colonne_gauche || []), ...(services.nosServices_colonne_droite || [])]
  return getFirstImageFromBlocks(allBlocks, services.images || [])
})

const controleBornesImage = computed(() => {
  if (!data.value?.result?.services) return null
  const services = data.value.result.services as any
  const allBlocks = [...(services.controleBornes_colonne_gauche || []), ...(services.controleBornes_colonne_droite || [])]
  return getFirstImageFromBlocks(allBlocks, services.images || [])
})

const controlePhotovoltaiqueImage = computed(() => {
  if (!data.value?.result?.services) return null
  const services = data.value.result.services as any
  const allBlocks = [...(services.controlePhotovoltaique_colonne_gauche || []), ...(services.controlePhotovoltaique_colonne_droite || [])]
  return getFirstImageFromBlocks(allBlocks, services.images || [])
})
</script>

<style lang="scss" scoped>
.v-index {
  width: 100%;
}

.hero-section {
  position: relative;
  min-height: 85vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 var(--page-gutter);
  border-radius: var(--radius-l);
}

.hero-image-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: var(--space-xxxl) var(--space-xxl);
  max-width: 900px;
}

.hero-title {
  color: white;
  margin: 0;
}

.hero-title :deep(h1),
.hero-title :deep(h2),
.hero-title :deep(h3),
.hero-title :deep(h4) {
  margin: 0;
  line-height: 1.2;
  font-weight: 800;
}

.hero-title :deep(h1) {
  font-size: clamp(2.25rem, 4vw, 3.5rem);
}

.hero-title :deep(h2) {
  font-size: clamp(1.75rem, 3.5vw, 2.75rem);
}

.hero-title :deep(h3) {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
}

.hero-title :deep(h4) {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
}

.hero-title :deep(p) {
  margin: 0;
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    margin: 0 var(--page-gutter-mobile);
  }

  .hero-content {
    padding: var(--space-xl) var(--space-l);
  }
}

.section {
  padding-block: var(--space-xxxl);

  @media (max-width: 768px) {
    padding-block: var(--space-xxl);
  }
}

// Ancres pour navigation smooth scroll
section[id] {
  scroll-margin-top: 80px;

  @media (max-width: 768px) {
    scroll-margin-top: 70px;
  }
}

section.section-with-anchor {
  @media (max-width: 768px) {
    scroll-margin-top: 70px;
  }
}

// Services Section
.services-section {
  margin: var(--space-xl) var(--page-gutter);
  padding: var(--space-xl) var(--page-gutter);
  width: 100%;
  max-width: calc(100% - (var(--page-gutter) * 2));
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin: var(--space-l) var(--page-gutter-mobile);
    padding: var(--space-l) var(--page-gutter-mobile);
    max-width: calc(100% - (var(--page-gutter-mobile) * 2));
  }
}

.services-inner {
  max-width: var(--container-width);
  margin: 0 auto;
}

.services-title {
  color: var(--color-secondary);
  margin-bottom: var(--space-xl);
  text-transform: capitalize;
}

.services-title :deep(h1),
.services-title :deep(h2),
.services-title :deep(h3),
.services-title :deep(h4) {
  margin: 0;
  line-height: 1.2;
}

.services-title :deep(h1) {
  font-size: clamp(2rem, 3.2vw, 2.6rem);
}

.services-title :deep(h2) {
  font-size: clamp(1.7rem, 2.8vw, 2.2rem);
}

.services-title :deep(h3) {
  font-size: clamp(1.5rem, 2.4vw, 1.95rem);
}

.services-title :deep(h4) {
  font-size: clamp(1.3rem, 2vw, 1.7rem);
}

.services-title :deep(p) {
  margin: 0;
  line-height: 1.6;
}

.services-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-l);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.service-card {
  position: relative;
  border-radius: var(--radius-l);
  overflow: hidden;
  text-decoration: none;
  display: block;
  aspect-ratio: 1 / 1;

  &:hover {
    .service-card-image img {
      transform: scale(1.05);
    }
  }
}

.service-card-image {
  position: absolute;
  inset: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
    border-radius: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.2) 50%, transparent 100%);
  }
}

.service-card-title {
  position: absolute;
  bottom: var(--space-l);
  left: var(--space-l);
  right: var(--space-l);
  color: var(--service-card-title-color);
  margin: 0;
  z-index: 1;
  --service-card-title-size: clamp(1.4rem, 2.6vw, 1.9rem);
  --service-card-title-color: var(--color-neutral);
}

.service-card-title.card-title-small {
  --service-card-title-size: clamp(1.2rem, 2.2vw, 1.6rem);
}

.service-card-title.card-title-large {
  --service-card-title-size: clamp(1.6rem, 3vw, 2.3rem);
}

.service-card-title.card-color-primary {
  --service-card-title-color: var(--color-primary);
}

.service-card-title.card-color-secondary {
  --service-card-title-color: var(--color-secondary);
}

.service-card-title.card-color-accent {
  --service-card-title-color: var(--color-accent);
}

.service-card-title.card-color-neutral {
  --service-card-title-color: var(--color-neutral);
}

.service-card-title.card-color-dark {
  --service-card-title-color: var(--color-dark);
}

.service-card-title :deep(h1),
.service-card-title :deep(h2),
.service-card-title :deep(h3),
.service-card-title :deep(h4) {
  margin: 0;
  line-height: 1.2;
  font-size: var(--service-card-title-size);
  color: inherit;
}

.service-card-title :deep(p) {
  margin: 0;
  line-height: 1.5;
  font-size: var(--service-card-title-size);
  color: inherit;
}

.debug-info {
  background: #fff3cd;
  border: 2px solid #ffc107;
  padding: var(--space-xl);
  margin: var(--space-xl);
  border-radius: var(--radius-m);
  font-family: monospace;
  font-size: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
  color: #333;

  h2 {
    margin: 0 0 var(--space-m) 0;
    font-size: 1rem;
  }

  p {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
}
</style>
