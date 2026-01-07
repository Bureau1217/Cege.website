<template>
  <div class="section-card">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Section card wrapper component
</script>

<style scoped lang="scss">
.section-card {
  background: #ffffff;
  border-radius: var(--radius-l);
  margin: var(--space-xxxl) var(--space-xl);
  padding: var(--space-xxxl) var(--space-l);
  width: 100%;
  max-width: calc(100% - (var(--space-xl) * 2));
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  @media (max-width: 1024px) {
    margin: var(--space-xxl) var(--space-xl);
    padding: var(--space-xxl) var(--space-l);
    max-width: calc(100% - (var(--space-xl) * 2));
  }

  @media (max-width: 768px) {
    margin: var(--space-xl) var(--space-m);
    padding: var(--space-xl) var(--space-m);
    border-radius: var(--radius-m);
    max-width: calc(100% - (var(--space-m) * 2));
  }
}
</style>
