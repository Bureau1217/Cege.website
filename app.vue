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
const isReady = ref(false)

onMounted(() => {
  setTimeout(() => {
    isReady.value = true
  }, 400)
})
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
