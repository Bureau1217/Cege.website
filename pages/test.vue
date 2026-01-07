<template>
  <div style="padding: 2rem; background: white; min-height: 100vh; color: black;">
    <h1 style="color: blue; font-size: 2rem; margin-bottom: 2rem;">Test de connexion API</h1>

    <p>Page chargée!</p>
    <p>Pending: {{ pending }}</p>
    <p>Error: {{ error }}</p>
    <p>Data: {{ data ? 'Données présentes' : 'Pas de données' }}</p>

    <div v-if="pending" style="background: #ffa; padding: 1rem; margin: 1rem 0;">
      Chargement en cours...
    </div>

    <div v-if="error" style="background: #fee; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
      <h3>Erreur:</h3>
      <pre style="white-space: pre-wrap;">{{ error }}</pre>
    </div>

    <div v-if="data" style="background: #efe; padding: 1rem; margin: 1rem 0; border-radius: 4px;">
      <h3>Succès! Données reçues:</h3>
      <pre style="white-space: pre-wrap; max-height: 400px; overflow: auto;">{{ JSON.stringify(data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('Test page loading...')

const { data, pending, error } = await useFetch('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: "site.find('home')",
    select: {
      title: true,
      builder: 'page.builder.toBlocks.toArray'
    }
  }
})

console.log('Fetch result:', { data: data.value, pending: pending.value, error: error.value })
</script>
