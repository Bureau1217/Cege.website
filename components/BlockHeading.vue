<template>
  <section class="block-heading-section">
    <div class="heading-inner">
      <!-- Colonne gauche: titre -->
      <div class="heading-left">
        <component
          :is="block.content.level || 'h2'"
          class="block-heading"
          :class="[
            `color-${block.content.color || 'default'}`
          ]"
        >
          {{ block.content.text }}
        </component>
      </div>

      <!-- Colonne droite: vide (pour le layout) -->
      <div class="heading-right"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  block: CMS_Block_Heading
}>()
</script>

<style scoped lang="scss">
.block-heading-section {
  background: #f5f5f5;
  padding: var(--space-xxxl) 0;
}

.heading-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxl);
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-xs);
  align-items: center;
}

.heading-left {
  animation: fadeInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.heading-right {
  animation: fadeInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.block-heading {
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;

  &.color-primary {
    color: var(--color-primary);
  }

  &.color-secondary {
    color: var(--color-secondary);
  }

  &.color-accent {
    color: var(--color-accent);
  }

  &.color-neutral {
    color: var(--color-neutral);
  }

  &.color-dark {
    color: var(--color-dark);
  }

  &.color-default {
    color: var(--color-dark);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .block-heading-section {
    padding: var(--space-xxl) 0;
  }

  .heading-inner {
    grid-template-columns: 1fr;
    gap: var(--space-l);
    padding: 0 var(--space-xs);
  }

  .heading-right {
    display: none;
  }
}

@media (max-width: 480px) {
  .block-heading-section {
    padding: var(--space-xl) 0;
  }

  .heading-inner {
    padding: 0 var(--space-xs);
  }
}
</style>
