<template>
  <main class="v-services">
    <template v-if="data?.status === 'ok' && services">
      <!-- Nos Services -->
      <SectionTwoColumns
        sectionId="nos-services"
        :titre="formatSectionTitle(services.nosServices_titre, 'Nos Services', services.nosServices_titre_couleur, services.nosServices_titre_taille)"
        :colonneGauche="services.nosServices_colonne_gauche || []"
        :colonneDroite="services.nosServices_colonne_droite || []"
        :images="services.images || []"
      />

      <!-- Notre Démarche -->
      <SectionNotreDemarche
        sectionId="notre-demarche"
        :titre="formatSectionTitle(services.notreDemarche_titre, 'Notre Démarche', services.notreDemarche_titre_couleur, services.notreDemarche_titre_taille)"
        :colonneGauche="services.notreDemarche || []"
        :colonneDroite="[]"
        :images="services.images || []"
        schemaOnly
      />

      <!-- Contrôle des bornes de recharge -->
      <SectionTwoColumns
        variant="white"
        sectionId="controle-bornes"
        :titre="formatSectionTitle(services.controleBornes_titre, 'Contrôle des bornes de recharge', services.controleBornes_titre_couleur, services.controleBornes_titre_taille)"
        :colonneGauche="services.controleBornes_colonne_gauche || []"
        :colonneDroite="services.controleBornes_colonne_droite || []"
        :images="services.images || []"
      />

      <!-- Contrôles photovoltaïques -->
      <SectionTwoColumns
        variant="white"
        sectionId="controle-photovoltaique"
        :titre="formatSectionTitle(services.controlePhotovoltaique_titre, 'Contrôles photovoltaïques', services.controlePhotovoltaique_titre_couleur, services.controlePhotovoltaique_titre_taille)"
        :colonneGauche="services.controlePhotovoltaique_colonne_gauche || []"
        :colonneDroite="services.controlePhotovoltaique_colonne_droite || []"
        :images="services.images || []"
      />
    </template>

    <!-- Loading State -->
    <template v-else-if="pending">
      <div class="loading-state"></div>
    </template>

    <!-- Page d'erreur -->
    <template v-else>
      <div class="error-state">
        <h1>Erreur de chargement</h1>
        <p>Impossible de charger le contenu depuis le CMS.</p>
        <p v-if="data?.message">{{ data.message }}</p>
        <p v-if="data?.status">Status: {{ data.status }}</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
// Type pour la structure des données - utilise les types définis dans cms_api.d.ts
type FetchData = CMS_API_Response & {
  result: {
    services: CMS_API_ServicesPage
    siteSeo: any
  }
}

// Fetch des données avec KQL - même pattern que MSS AVOCATES
const { data, pending } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: 'site',
    select: {
      siteSeo: {
        title: 'site.title',
        metaTemplate: 'site.metaTemplate.value',
        metaDescription: 'site.metaDescription.value',
        ogTemplate: 'site.ogTemplate.value',
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
      services: {
        query: "site.find('services')",
        select: {
          title: true,
          slug: true,
          seo: {
            metaTitle: 'page.metaTitle.value',
            metaDescription: 'page.metaDescription.value',
            metaTemplate: 'page.metaTemplate.value',
            useTitleTemplate: 'page.useTitleTemplate.value',
            ogTemplate: 'page.ogTemplate.value',
            useOgTemplate: 'page.useOgTemplate.value',
            ogDescription: 'page.ogDescription.value',
            ogImage: 'page.ogImage.value',
            twitterCardType: 'page.twitterCardType.value',
            twitterAuthor: 'page.twitterAuthor.value'
          },

          nosServices_titre: 'page.nosServices_titre.value',
          nosServices_titre_couleur: 'page.nosServices_titre_couleur.value',
          nosServices_titre_taille: 'page.nosServices_titre_taille.value',
          nosServices_colonne_gauche: 'page.nosServices_colonne_gauche.toBlocks.toArray',
          nosServices_colonne_droite: 'page.nosServices_colonne_droite.toBlocks.toArray',

          notreDemarche_titre: 'page.notreDemarche_titre.value',
          notreDemarche_titre_couleur: 'page.notreDemarche_titre_couleur.value',
          notreDemarche_titre_taille: 'page.notreDemarche_titre_taille.value',
          notreDemarche: 'page.notreDemarche.toBlocks.toArray',

          controleBornes_titre: 'page.controleBornes_titre.value',
          controleBornes_titre_couleur: 'page.controleBornes_titre_couleur.value',
          controleBornes_titre_taille: 'page.controleBornes_titre_taille.value',
          controleBornes_colonne_gauche: 'page.controleBornes_colonne_gauche.toBlocks.toArray',
          controleBornes_colonne_droite: 'page.controleBornes_colonne_droite.toBlocks.toArray',

          controlePhotovoltaique_titre: 'page.controlePhotovoltaique_titre.value',
          controlePhotovoltaique_titre_couleur: 'page.controlePhotovoltaique_titre_couleur.value',
          controlePhotovoltaique_titre_taille: 'page.controlePhotovoltaique_titre_taille.value',
          controlePhotovoltaique_colonne_gauche: 'page.controlePhotovoltaique_colonne_gauche.toBlocks.toArray',
          controlePhotovoltaique_colonne_droite: 'page.controlePhotovoltaique_colonne_droite.toBlocks.toArray',

          images: {
            query: 'page.files',
            select: {
              uuid: 'file.uuid',
              url: 'file.url',
              tiny: 'file.resize(50, null, 10)',
              small: 'file.resize(500)',
              reg: 'file.resize(1280)',
              large: 'file.resize(1920)',
              xxl: 'file.resize(2500)',
              alt: 'file.alt.value'
            }
          }
        }
      }
    }
  }
})

const services = computed(() => data.value?.result?.services ?? null)
const siteSeo = computed(() => data.value?.result?.siteSeo ?? null)
const servicesSeo = computed(() => (data.value?.result?.services as any)?.seo ?? null)
const seoFiles = computed(() => [
  ...((data.value?.result?.services as any)?.images || []),
  ...(siteSeo.value?.files || [])
])

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

useSeo({
  page: servicesSeo,
  site: siteSeo,
  title: computed(() => (data.value?.result?.services as any)?.title || 'Services'),
  files: seoFiles
})
</script>

<style scoped lang="scss">
.v-services {
  width: 100%;
}

.v-services :deep(.column-list ul) {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.v-services :deep(.column-list ul li) {
  position: relative;
  padding-left: 1.75rem;
}

.v-services :deep(.column-list ul li::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0.35em;
  width: 0.95rem;
  height: 0.95rem;
  background-color: var(--color-accent);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M9 16.2L5.5 12.7 4 14.2l5 5L20 8.2 18.5 6.8z'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='black' d='M9 16.2L5.5 12.7 4 14.2l5 5L20 8.2 18.5 6.8z'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

// Section Nos Services - image limitée à la hauteur de la colonne droite
.v-services :deep(#nos-services + .two-columns-inner) {
  align-items: start;

  .column-left .column-image {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    border-radius: var(--radius-m);
  }
}
</style>
