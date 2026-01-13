<template>
  <div
    class="block-contact-info"
    :class="`layout-${block.content.layout || 'grid'}`"
  >

    <div class="contact-items">
      <div
        v-for="(item, index) in block.content.items"
        :key="index"
        class="contact-item"
        :class="{ highlight: item.highlight === 'true' }"
      >
        <div v-if="item.icon && item.icon.length > 0" class="contact-icon">
          <img :src="getFileUrl(item.icon)" :alt="item.label || ''" />
        </div>

        <div class="contact-content">
          <div class="contact-label">{{ item.label }}</div>
          <div class="contact-text">{{ item.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  block: CMS_Block_ContactInfo
  files?: any[]
}>()

const { getCmsImageUrl } = useCmsImage(computed(() => props.files || []))

const resolveFileRef = (value: unknown) => {
  if (!value) return null
  if (Array.isArray(value)) return resolveFileRef(value[0])
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const file = value as { uuid?: string; url?: string }
    if (file.url) return file.url
    if (file.uuid) return `file://${file.uuid}`
  }
  return null
}

const getFileUrl = (value: unknown) => {
  const ref = resolveFileRef(value)
  if (!ref) return ''
  return getCmsImageUrl(ref)
}
</script>

<style scoped lang="scss">
.block-contact-info {
  margin-block: 0;
}

.contact-title {
  text-align: center;
  margin-bottom: var(--space-xxl);
  font-size: clamp(1.875rem, 4.5vw, 2.75rem);
  font-weight: 800;
  color: var(--color-dark);
}

.contact-items {
  display: grid;
  gap: var(--space-l);
  grid-template-columns: repeat(2, 1fr);

  .layout-list & {
    grid-template-columns: 1fr;
    max-width: 600px;
    margin-inline: auto;
  }
}

.contact-item {
  display: flex;
  gap: var(--space-m);
  align-items: flex-start;
  padding: var(--space-l);
  background: transparent;
  border: 2px solid transparent;
  border-radius: var(--radius-m);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--radius-m);
    padding: 1px;
    background: var(--color-accent);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 1;
  }

  &:hover::before {
    animation: borderDraw 0.4s ease-in-out;
  }
}

@keyframes borderDraw {
  0% {
    clip-path: inset(0 100% 0 0);
  }
  100% {
    clip-path: inset(0 0 0 0);
  }
}

.contact-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    border-radius: 0;
    background: transparent;
  }
}

.contact-content {
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-xs);
  color: white;
  opacity: 0.9;
}

.contact-text {
  color: white;
  line-height: 1.8;
  white-space: pre-line;
  opacity: 0.9;
  transition: opacity 0.3s ease;
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
}

@media (max-width: 768px) {
  .contact-items {
    &.layout-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    &.layout-list {
      grid-template-columns: 1fr;
    }
  }

  .contact-item {
    padding: var(--space-m);
  }

  .contact-icon {
    width: 40px;
    height: 40px;
  }

  .contact-label {
    font-size: 0.8rem;
  }

  .contact-text {
    font-size: var(--text-small-size);
  }
}

@media (max-width: 480px) {
  .contact-items {
    grid-template-columns: 1fr;
    gap: var(--space-m);
  }

  .contact-item {
    padding: var(--space-m);
  }

  .contact-icon {
    width: 36px;
    height: 36px;
  }

  .contact-label {
    font-size: 0.75rem;
  }

  .contact-text {
    font-size: 0.95rem;
  }
}
</style>
