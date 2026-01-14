<template>
  <main class="v-contact">
    <template v-if="data?.status === 'ok' && contact">
      <!-- Formulaire Section -->
      <div id="formulaire">
        <SectionFormulaire
          :titre="contact.formulaire_titre || '<h2>Formulaire</h2>'"
          :blocks="contact.formulaire || []"
          variant="white"
          layout="split"
          :introText="contact.formulaire_intro || ''"
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
  }
}

// Fetch des données avec KQL
const { data, pending } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      contact: {
        query: "site.find('contact')",
        select: {
          title: true,
          slug: true,
          formulaire_titre: 'page.formulaire_titre.toBlocks.toHtml',
          formulaire_intro: 'page.formulaire_intro.toBlocks.toHtml',
          formulaire: 'page.formulaire.toBlocks.toArray'
        }
      }
    }
  }
})

const contact = computed(() => data.value?.result?.contact ?? null)

useHead({
  title: 'Contact - CEGE',
  meta: [
    { name: 'description', content: 'Contactez-nous' }
  ]
})
</script>

<style scoped lang="scss">
.v-contact {
  width: 100%;
}

</style>
