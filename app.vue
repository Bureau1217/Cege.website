<template>
  <div>
    <!-- Page Loader (visible par défaut) -->
    <div v-if="!isReady" class="page-loader">
      <div class="loader-content">
        <div class="loader-spinner"></div>
      </div>
    </div>

    <!-- Contenu (caché puis fade in) -->
    <div :class="['app-content', { 'is-ready': isReady }]">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSchemaOrg } from '@/composables/useSchemaOrg'

const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 400)
})

// Schema.org structured data for Google
const { addLocalBusiness, addWebSite } = useSchemaOrg()

addLocalBusiness({
  name: 'CéGé Swiss',
  description: 'Contrôles électriques, photovoltaïques et bornes de recharge. Sécurité, conformité et fiabilité des installations en Suisse romande.',
  telephone: '+41 79 604 88 88',
  email: 'erik@cegeswiss.com',
  address: {
    streetAddress: 'Chemin de la Verseuse 7/9',
    addressLocality: 'Aïre',
    postalCode: '1219',
    addressCountry: 'CH',
  },
  openingHours: ['Mo-Fr 08:00-18:00'],
  priceRange: '$$',
})

addWebSite(
  'CéGé Swiss',
  'Contrôles électriques pour vérifier la sécurité, la conformité et le bon fonctionnement de vos installations en Suisse romande.'
)
</script>

<style>
.page-loader {
  position: fixed;
  inset: 0;
  background: var(--color-background, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-secondary, #c64949);
  border-top-color: var(--color-primary, #3b75db);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
