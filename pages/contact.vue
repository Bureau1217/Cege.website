<template>
  <main class="v-contact">
    <template v-if="data && data.status === 'ok'">
      <!-- Formulaire Section -->
      <div id="formulaire">
        <SectionFormulaire
          :titre="data.result.contact.formulaire_titre || '<h2>Formulaire</h2>'"
          :blocks="data.result.contact.formulaire || []"
          variant="white"
          layout="split"
          :introText="data.result.contact.formulaire_intro || ''"
        />
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
const { data } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
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
