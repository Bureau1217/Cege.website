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
const { addLocalBusiness, addWebSite, addSiteNavigation } = useSchemaOrg()

addLocalBusiness({
  type: ['Electrician', 'LocalBusiness', 'ProfessionalService'],
  name: 'CéGé GEORGES Erik',
  description: 'Électricien expert en contrôle électrique et sécurité à Genève et en Suisse romande. Contrôles OIBT, diagnostics de conformité, contrôle des installations électriques, bornes de recharge et photovoltaïque.',
  telephone: '+41 79 604 88 88',
  email: 'erik@cegeswiss.com',
  address: {
    streetAddress: 'Chemin de la Verseuse 7/9',
    addressLocality: 'Aïre',
    addressRegion: 'Genève',
    postalCode: '1219',
    addressCountry: 'CH',
  },
  geo: {
    latitude: 46.1983,
    longitude: 6.1008,
  },
  areaServed: [
    { type: 'City', name: 'Genève' },
    { type: 'State', name: 'Canton de Genève' },
    { type: 'State', name: 'Canton de Vaud' },
    { type: 'AdministrativeArea', name: 'Suisse romande' },
  ],
  services: [
    'Contrôle électrique OIBT',
    'Contrôle des installations électriques',
    'Diagnostic de conformité électrique',
    'Sécurité électrique',
    'Contrôle de bornes de recharge',
    'Contrôle d\'installations photovoltaïques',
  ],
  openingHours: ['Mo-Fr 08:00-18:00'],
  priceRange: '$$',
  logo: 'https://cegeswiss.com/Favicon_Cege.png',
  image: 'https://cegeswiss.com/Opengraph_Cege.png',
})

addWebSite(
  'CéGé GEORGES Erik - Contrôle électrique & sécurité',
  'Expert en contrôle électrique et sécurité à Genève. Contrôles périodiques OIBT, bornes de recharge et installations photovoltaïques en Suisse romande.'
)

// Navigation elements for Google sitelinks
addSiteNavigation([
  {
    name: 'Services',
    url: '/services',
    description: 'Contrôles électriques OIBT, bornes de recharge et installations photovoltaïques. Expertise et conformité garanties.'
  },
  {
    name: 'Contact',
    url: '/contact',
    description: 'Contactez CéGé GEORGES Erik pour vos contrôles électriques. Intervention rapide en Suisse romande.'
  }
])
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
