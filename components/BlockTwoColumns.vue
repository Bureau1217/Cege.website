<template>
  <section class="block-two-columns">
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
            <div v-else-if="block.type === 'features-grid' && block.content?.items" class="feature-items">
              <div v-for="(item, itemIdx) in block.content.items" :key="itemIdx" class="feature-item-card" :style="getFeatureItemStyle(item)">
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
            <div v-else-if="block.type === 'features-grid' && block.content?.items" class="feature-items">
              <div v-for="(item, itemIdx) in block.content.items" :key="itemIdx" class="feature-item-card" :style="getFeatureItemStyle(item)">
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
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'

const props = defineProps<{
  colonneGauche: any[]
  colonneDroite: any[]
  images: any[]
}>()

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
                imagesByUuid.value['file://' + uuid]
    return img
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
  return 'color-dark'
}

const getTextColorClass = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `color-${color}`
  }
  return 'color-dark'
}

const getColorVar = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `var(--color-${color})`
  }
  return ''
}

const getFeatureItemStyle = (item: any) => {
  const style: Record<string, string> = {}
  const iconColor = getColorVar(item?.icon_color)
  if (iconColor) {
    style['--feature-item-icon-color'] = iconColor
  }
  const textColor = getColorVar(item?.text_color)
  if (textColor) {
    style['--feature-item-title-color'] = textColor
    style['--feature-item-text-color'] = textColor
  }
  const backgroundColor = getColorVar(item?.background_color)
  if (backgroundColor) {
    style['--feature-item-bg-color'] = backgroundColor
  }
  return style
}
</script>

<style scoped lang="scss">
.block-two-columns {
  padding: var(--space-xl) 0;
}

.two-columns-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxl);
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--space-xs);
  align-items: start;
}

.column {
  animation: fadeInUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.column-left {
  animation: fadeInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.column-right {
  animation: fadeInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.column-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}

.column-text {
  :deep(strong) {
    font-weight: 600;
  }

  :deep(em) {
    font-style: italic;
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 0.8;
    }
  }
}

.column-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-l);
  transition: transform 0.6s ease;
  display: block;
  margin: var(--space-m) 0;

  &:hover {
    transform: scale(1.03);
  }
}

.feature-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
}

.feature-item-card {
  display: flex;
  gap: var(--space-m);
  align-items: flex-start;
  background: var(--feature-item-bg-color);
  --feature-item-icon-color: var(--color-accent);
  --feature-item-title-color: var(--color-dark);
  --feature-item-text-color: var(--color-dark);
  --feature-item-bg-color: transparent;
}

.feature-item-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  display: inline-block;
  background-color: var(--feature-item-icon-color);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  flex-shrink: 0;
}

.feature-item-content {
  flex: 1;
}

.feature-item-title {
  margin: 0 0 var(--space-s) 0;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--feature-item-title-color);
}

.feature-item-text {
  margin: 0;
  font-size: var(--text-small-size);
  font-weight: var(--text-small-weight);
  line-height: 1.6;
  color: var(--feature-item-text-color);
  opacity: 0.85;

  :deep(strong) {
    font-weight: 600;
  }

  :deep(em) {
    font-style: italic;
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .two-columns-inner {
    gap: var(--space-l);
  }

  .column-heading {
    font-size: clamp(1.25rem, 2.5vw, 2rem);
  }
}

@media (max-width: 768px) {
  .block-two-columns {
    padding: var(--space-xxl) 0;
  }

  .two-columns-inner {
    grid-template-columns: 1fr;
    gap: var(--space-l);
    padding: 0 var(--space-s);
  }

  .column-heading {
    font-size: clamp(1.25rem, 3vw, 1.75rem);
  }

  .column-text {
    font-size: var(--text-small-size);
  }

  .column-list {
    font-size: var(--text-small-size);
  }
}

@media (max-width: 480px) {
  .block-two-columns {
    padding: var(--space-xl) 0;
  }

  .two-columns-inner {
    padding: 0 var(--space-m);
  }

  .column-heading {
    font-size: 1.25rem;
  }

  .column-text {
    font-size: 0.95rem;
  }

  .column-list {
    font-size: 0.95rem;
  }
}
</style>
