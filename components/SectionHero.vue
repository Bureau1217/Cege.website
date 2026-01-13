<template>
  <section
    class="block-hero"
    :class="[
      `theme-${block.content.theme || 'light'}`
    ]"
  >
    <div class="hero-inner">
      <!-- Bloc gauche: couleur + contenu -->
      <div class="hero-left-block">
        <div class="hero-content">
          <h1 v-if="block.content.title" class="hero-title">{{ block.content.title }}</h1>
          <p v-if="block.content.text" class="hero-text">{{ block.content.text }}</p>
        </div>
      </div>

      <!-- Bloc droite: image sans fond -->
      <div class="hero-right-block" v-if="imageUrl">
        <img :src="imageUrl" :alt="block.content.title || ''" class="hero-image" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  block: CMS_Block_Hero
  files?: any[]
}>()

const { getCmsImageUrl } = useCmsImage(computed(() => props.files || []))

// Récupérer l'URL de l'image depuis le file://id
const imageUrl = computed(() => {
  if (props.block.content.image && props.block.content.image.length > 0) {
    return getCmsImageUrl(props.block.content.image[0])
  }
  return null
})
</script>

<style scoped lang="scss">
.block-hero {
  position: relative;
  min-height: auto;
  background: transparent;
  border-radius: var(--radius-l);
  margin: 0 var(--page-gutter) 0;
  padding: 0;
  width: 100%;
  max-width: calc(100% - (var(--page-gutter) * 2));
  box-sizing: border-box;
  scroll-margin-top: 80px;
  overflow: hidden;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-l);
  padding: var(--space-xxl) 0;
  align-items: stretch;
}

// Bloc gauche: fond de couleur avec contenu
.hero-left-block {
  position: relative;
  background: var(--color-primary);
  border-radius: var(--radius-l);
  overflow: hidden;
  min-height: 750px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: slideInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.05));
    z-index: 1;
    pointer-events: none;
  }
}

// Contenu à l'intérieur du bloc gauche
.hero-content {
  position: relative;
  z-index: 2;
  padding: var(--space-xxxl) var(--space-xxl);
  animation: fadeInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
  text-align: center;
}

.hero-title {
  margin-bottom: var(--space-xl);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  word-spacing: -0.05em;
  letter-spacing: -0.02em;
  margin-top: 0;
}

.hero-text {
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin-bottom: 0;
  line-height: 1.8;
  opacity: 0.9;
  font-weight: 500;
  max-width: 100%;
}

// Bloc droit: image avec coins arrondis, sans fond
.hero-right-block {
  position: relative;
  min-height: 750px;
  overflow: hidden;
  border-radius: var(--radius-l);
  animation: slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-l);
  transition: transform 0.6s ease;
  display: block;

  .hero-right-block:hover & {
    transform: scale(1.05);
  }
}

// Thèmes
.theme-dark {
  .hero-left-block {
    background: var(--color-primary);
  }

  .hero-title,
  .hero-text {
    color: var(--color-neutral);
  }
}

.theme-light {
  .hero-left-block {
    background: var(--color-secondary);
  }

  .hero-title,
  .hero-text {
    color: var(--color-dark);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 1024px) {
  .hero-inner {
    grid-template-columns: 1fr 1fr;
    gap: var(--space-l);
  }

  .hero-left-block {
    min-height: 550px;
  }

  .hero-right-block {
    min-height: 550px;
  }

  .hero-title {
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  }
}

@media (max-width: 768px) {
  .block-hero {
    padding: var(--space-xxl) 0;
    margin: 0 var(--page-gutter-mobile) 0;
    max-width: calc(100% - (var(--page-gutter-mobile) * 2));
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: var(--space-l);
    padding: 0 var(--space-s);
  }

  .hero-left-block {
    min-height: 450px;
    order: -1;
  }

  .hero-right-block {
    min-height: 350px;
  }

  .hero-content {
    padding: var(--space-xl) var(--space-l);
  }

  .hero-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    margin-bottom: var(--space-l);
  }

  .hero-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .block-hero {
    padding: var(--space-xl) 0;
  }

  .hero-inner {
    padding: 0 var(--space-m);
  }

  .hero-content {
    padding: var(--space-l) var(--space-m);
  }

  .hero-left-block {
    min-height: 300px;
  }

  .hero-right-block {
    min-height: 250px;
  }

  .hero-title {
    font-size: 1.25rem;
  }

  .hero-text {
    font-size: 0.9rem;
  }
}
</style>
