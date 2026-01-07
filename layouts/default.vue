<template>
  <div class="app-layout">
    <Header />
    <main class="app-main">
      <slot />
    </main>
    <CookieBanner />
    <SectionFooter />
  </div>
</template>

<script setup lang="ts">
// Fetch and apply site colors from CMS
useSiteSettings()
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
}
</style>
