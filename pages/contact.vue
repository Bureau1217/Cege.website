<template>
  <main class="v-contact">
    <template v-if="data?.status === 'ok' && contact">
      <!-- Formulaire Section -->
      <div id="formulaire">
        <SectionFormulaire
          :titre="formatSectionTitle(contact.formulaire_titre, 'Formulaire')"
          :blocks="contact.formulaire || []"
          variant="white"
          layout="split"
          :introText="contact.formulaire_intro || ''"
          class="contact-style-block"
        />
      </div>
    </template>

    <template v-else>
      <div class="error-state">
        <h1>Erreur de chargement</h1>
        <p>Impossible de charger le contenu depuis le CMS.</p>
        <p v-if="data?.message">{{ data.message }}</p>
        <p v-if="pending">Chargement en cours...</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
// Type pour la structure des données
type FetchData = CMS_API_Response & {
  result: {
    contact: CMS_API_ContactPage
    siteSeo: any
  }
}

// Fetch des données avec KQL
const { data, pending } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
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
      contact: {
        query: "site.find('contact')",
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
          formulaire_titre: 'page.formulaire_titre.value',
          formulaire_intro: 'page.formulaire_intro.toBlocks.toHtml',
          formulaire: 'page.formulaire.toBlocks.toArray'
        }
      }
    }
  }
})

const contact = computed(() => data.value?.result?.contact ?? null)
const siteSeo = computed(() => data.value?.result?.siteSeo ?? null)
const contactSeo = computed(() => (data.value?.result?.contact as any)?.seo ?? null)
const seoFiles = computed(() => [
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

const formatSectionTitle = (value?: string, fallback?: string) => {
  const text = (value || '').trim() || (fallback || '').trim()
  if (!text) return ''
  return `<h4>${escapeHtml(text)}</h4>`
}

useSeo({
  page: contactSeo,
  site: siteSeo,
  title: computed(() => (data.value?.result?.contact as any)?.title || 'Contact'),
  files: seoFiles
})
</script>

<style scoped lang="scss">
.v-contact {
  width: 100%;
}

</style>
