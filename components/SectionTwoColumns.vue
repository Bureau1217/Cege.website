<template>
  <StyleBlock :variant="variant">
    <div v-if="titre" class="section-title-wrapper" :id="sectionId">
      <div class="section-title" v-html="titre" />
    </div>
    <div class="two-columns-inner">
      <!-- COLONNE GAUCHE -->
      <div class="column column-left">
        <div class="column-content">
          <template v-for="(block, index) in colonneGauche" :key="index">
            <component
              :is="getHeadingTag(block.content?.level)"
              v-if="block.type === 'heading' && block.content?.text"
              class="column-heading"
              :class="getHeadingColorClass(block.content?.color)"
            >
              {{ block.content.text }}
            </component>
            <h4
              v-else-if="block.type === 'soustitre' && block.content?.text"
              class="column-heading"
              :class="getHeadingColorClass(block.content?.color)"
              v-html="block.content.text"
            ></h4>
            <div
              v-else-if="block.type === 'text' && block.content?.text"
              class="column-text"
              :class="getTextColorClass(block.content?.color)"
              v-html="block.content.text"
            ></div>
            <img
              v-else-if="block.type === 'image' && block.content?.image && getImageFromUuid(block.content.image)"
              :src="getImageFromUuid(block.content.image)?.reg?.url"
              :alt="block.content?.alt || getImageFromUuid(block.content.image)?.alt || ''"
              class="column-image"
            />
            <div v-else-if="block.type === 'list' && block.content?.text" class="column-list" v-html="block.content.text"></div>
            <div v-else-if="block.type === 'feature-item' && block.content?.items" class="feature-items">
              <div v-for="(item, itemIdx) in block.content.items" :key="itemIdx" class="feature-item-card">
                <span
                  v-if="item.icon"
                  class="feature-item-icon"
                  :style="getIconStyle(item.icon)"
                  aria-hidden="true"
                />
                <div class="feature-item-content">
                  <h3 v-if="item.title" class="feature-item-title">{{ item.title }}</h3>
                  <p v-if="item.text" class="feature-item-text" v-html="item.text"></p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- COLONNE DROITE -->
      <div class="column column-right">
        <div class="column-content">
          <template v-for="(block, index) in colonneDroite" :key="index">
            <component
              :is="getHeadingTag(block.content?.level)"
              v-if="block.type === 'heading' && block.content?.text"
              class="column-heading"
              :class="getHeadingColorClass(block.content?.color)"
            >
              {{ block.content.text }}
            </component>
            <h4
              v-else-if="block.type === 'soustitre' && block.content?.text"
              class="column-heading"
              :class="getHeadingColorClass(block.content?.color)"
              v-html="block.content.text"
            ></h4>
            <div
              v-else-if="block.type === 'text' && block.content?.text"
              class="column-text"
              :class="getTextColorClass(block.content?.color)"
              v-html="block.content.text"
            ></div>
            <img
              v-else-if="block.type === 'image' && block.content?.image && getImageFromUuid(block.content.image)"
              :src="getImageFromUuid(block.content.image)?.reg?.url"
              :alt="block.content?.alt || getImageFromUuid(block.content.image)?.alt || ''"
              class="column-image"
            />
            <div v-else-if="block.type === 'list' && block.content?.text" class="column-list" v-html="block.content.text"></div>
            <div v-else-if="block.type === 'feature-item' && block.content?.items" class="feature-items">
              <div v-for="(item, itemIdx) in block.content.items" :key="itemIdx" class="feature-item-card">
                <span
                  v-if="item.icon"
                  class="feature-item-icon"
                  :style="getIconStyle(item.icon)"
                  aria-hidden="true"
                />
                <div class="feature-item-content">
                  <h3 v-if="item.title" class="feature-item-title">{{ item.title }}</h3>
                  <p v-if="item.text" class="feature-item-text" v-html="item.text"></p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </StyleBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StyleBlock from './StyleBlock.vue'
import { useCmsImage } from '@/composables/useCmsImage'

const props = withDefaults(
  defineProps<{
    titre?: string
    colonneGauche: any[]
    colonneDroite: any[]
    images: any[]
    sectionId?: string
    variant?: 'white' | 'primary' | 'transparent'
  }>(),
  {
    variant: 'transparent'
  }
)

const { getCmsImageUrl } = useCmsImage(computed(() => props.images || []))

// Create UUID -> image map for quick lookup
const imagesByUuid = computed(() => {
  const map: Record<string, any> = {}
  props.images?.forEach(img => {
    if (img.uuid) {
      map[img.uuid] = img
    }
  })
  return map
})

// Get image from UUID (handles both "file://" prefixed and non-prefixed UUIDs)
const getImageFromUuid = (uuid: string | string[]) => {
  if (Array.isArray(uuid) && uuid.length > 0) {
    uuid = uuid[0]
  }
  if (typeof uuid === 'string') {
    const img = imagesByUuid.value[uuid] ||
                imagesByUuid.value[uuid.replace('file://', '')] ||
                imagesByUuid.value[`file://${uuid}`]
    return img || null
  }
  return null
}

const resolveIconRef = (value: unknown) => {
  if (!value) return null
  if (Array.isArray(value)) return resolveIconRef(value[0])
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const icon = value as { uuid?: string; url?: string }
    if (icon.url) return icon.url
    if (icon.uuid) return `file://${icon.uuid}`
  }
  return null
}

const getIconStyle = (value: unknown) => {
  const ref = resolveIconRef(value)
  if (!ref) return {}
  const resolved = getCmsImageUrl(ref)
  return {
    maskImage: `url(${resolved})`,
    WebkitMaskImage: `url(${resolved})`
  }
}

const getHeadingTag = (level?: string) => {
  if (level === 'h1' || level === 'h2' || level === 'h3' || level === 'h4') {
    return level
  }
  return 'h2'
}

const getHeadingColorClass = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `color-${color}`
  }
  return 'color-primary'
}

const getTextColorClass = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `color-${color}`
  }
  return 'color-dark'
}
</script>

<style scoped lang="scss">
.two-columns-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxxl);
  max-width: var(--container-width);
  margin: 0 auto;
}

.column {
  display: flex;
  flex-direction: column;
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.column-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-m);
  object-fit: cover;
}

.feature-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}

.feature-item-card {
  display: flex;
  gap: var(--space-l);
  padding: var(--space-l);
  background: #f9f9f9;
}

.feature-item-icon {
  width: 40px;
  height: 40px;
  display: inline-block;
  flex-shrink: 0;
  background-color: var(--color-accent);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  border-radius: 0;
}

.feature-item-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);
}

.feature-item-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-primary);
}

.feature-item-text {
  font-size: var(--text-small-size);
  font-weight: var(--text-small-weight);
  line-height: 1.6;
  margin: 0;
  color: var(--color-dark);
  opacity: 0.85;
}

@media (max-width: 768px) {
  .two-columns-inner {
    grid-template-columns: 1fr;
    gap: var(--space-l);
  }
}
</style>
