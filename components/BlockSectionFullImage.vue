<template>
  <section
    class="block-section-full-image"
    :class="`height-${block.content.height || 'medium'}`"
    v-if="imageUrl"
  >
    <img :src="imageUrl" :alt="imageAlt" class="full-image" />
    <div v-if="block.content.overlay === 'true'" class="image-overlay"></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'

const props = defineProps<{
  block: CMS_Block_SectionFullImage
  files?: any[]
}>()

const { getCmsImageUrl } = useCmsImage(computed(() => props.files || []))

const resolveImageRef = (value: unknown) => {
  if (!value) return null
  if (Array.isArray(value)) return value[0] || null
  if (typeof value === 'string') return value
  return null
}

const imageRef = computed(() => resolveImageRef(props.block.content.image))

const imageUrl = computed(() => {
  if (!imageRef.value) return null
  return getCmsImageUrl(imageRef.value)
})

const imageAlt = computed(() => {
  return props.block.content.alt || props.block.content.sectionName || ''
})
</script>

<style scoped lang="scss">
.block-section-full-image {
  position: relative;
  width: 100%;
  max-width: calc(100% - (var(--page-gutter) * 2));
  margin: var(--space-xxxl) var(--page-gutter);
  overflow: hidden;
  border-radius: var(--radius-l);
  box-sizing: border-box;

  &.height-small {
    height: 40vh;
  }

  &.height-medium {
    height: 60vh;
  }

  &.height-large {
    height: 80vh;
  }

  &.height-full {
    height: 100vh;
  }
}

.full-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  animation: imageZoom 0.8s ease-out;

  .block-section-full-image:hover & {
    transform: scale(1.05);
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.2), rgba(24, 0, 158, 0.15));
  backdrop-filter: blur(0.5px);
  z-index: 1;
}

@keyframes imageZoom {
  from {
    transform: scale(1.08);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .block-section-full-image {
    margin: var(--space-xl) var(--page-gutter-mobile);
    max-width: calc(100% - (var(--page-gutter-mobile) * 2));
    border-radius: var(--radius-m);

    &.height-large,
    &.height-full {
      height: 70vh;
    }

    &.height-small {
      height: 30vh;
    }
  }
}

@media (max-width: 480px) {
  .block-section-full-image {
    margin: var(--space-l) var(--page-gutter-mobile);

    &.height-small,
    &.height-medium,
    &.height-large,
    &.height-full {
      height: 70vh;
    }
  }
}
</style>
