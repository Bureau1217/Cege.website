<template>
  <main class="v-services">
    <template v-if="data && data.status === 'ok'">
      <!-- Nos Services -->
      <SectionTwoColumns
        sectionId="nos-services"
        :titre="data.result.services.nosServices_titre || '<h2>Nos Services</h2>'"
        :colonneGauche="data.result.services.nosServices_colonne_gauche || []"
        :colonneDroite="data.result.services.nosServices_colonne_droite || []"
        :images="data.result.services.images || []"
      />

      <!-- Notre Démarche -->
      <SectionNotreDemarche
        sectionId="notre-demarche"
        :titre="data.result.services.notreDemarche_titre || '<h2>Notre Démarche</h2>'"
        :colonneGauche="data.result.services.notreDemarche || []"
        :colonneDroite="[]"
        :images="data.result.services.images || []"
        schemaOnly
      />

      <!-- Contrôle des bornes de recharge -->
      <SectionTwoColumns
        variant="white"
        sectionId="controle-bornes"
        :titre="data.result.services.controleBornes_titre || '<h2>Contrôle des bornes de recharge</h2>'"
        :colonneGauche="data.result.services.controleBornes_colonne_gauche || []"
        :colonneDroite="data.result.services.controleBornes_colonne_droite || []"
        :images="data.result.services.images || []"
      />

      <!-- Contrôles photovoltaïques -->
      <SectionTwoColumns
        variant="white"
        sectionId="controle-photovoltaique"
        :titre="data.result.services.controlePhotovoltaique_titre || '<h2>Contrôles photovoltaïques</h2>'"
        :colonneGauche="data.result.services.controlePhotovoltaique_colonne_gauche || []"
        :colonneDroite="data.result.services.controlePhotovoltaique_colonne_droite || []"
        :images="data.result.services.images || []"
      />
    </template>

    <!-- Page d'erreur -->
    <template v-else>
      <div class="error-state">
        <h1>Erreur de chargement</h1>
        <p>Impossible de charger le contenu depuis le CMS.</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
// Type pour la structure des données - utilise les types définis dans cms_api.d.ts
type FetchData = CMS_API_Response & {
  result: {
    services: CMS_API_ServicesPage
  }
}

// Fetch des données avec KQL - même pattern que MSS AVOCATES
const { data } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
      services: {
        query: "site.find('services')",
        select: {
          title: true,
          slug: true,

          nosServices_titre: 'page.nosServices_titre.toBlocks.toHtml',
          nosServices_colonne_gauche: 'page.nosServices_colonne_gauche.toBlocks.toArray',
          nosServices_colonne_droite: 'page.nosServices_colonne_droite.toBlocks.toArray',

          notreDemarche_titre: 'page.notreDemarche_titre.toBlocks.toHtml',
          notreDemarche: 'page.notreDemarche.toBlocks.toArray',

          controleBornes_titre: 'page.controleBornes_titre.toBlocks.toHtml',
          controleBornes_colonne_gauche: 'page.controleBornes_colonne_gauche.toBlocks.toArray',
          controleBornes_colonne_droite: 'page.controleBornes_colonne_droite.toBlocks.toArray',

          controlePhotovoltaique_titre: 'page.controlePhotovoltaique_titre.toBlocks.toHtml',
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

useHead({
  title: 'Services - CEGE',
  meta: [
    { name: 'description', content: 'Nos services et notre démarche' }
  ]
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

.error-state {
  text-align: center;
  padding: var(--space-xxxl);

  h1 {
    color: var(--color-primary);
    margin-bottom: var(--space-l);
  }

  p {
    color: var(--color-dark);
    opacity: 0.7;
  }
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
