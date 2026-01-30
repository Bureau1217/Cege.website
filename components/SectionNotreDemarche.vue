<template>
  <div class="section-wrapper">
    <div v-if="titre" class="section-title-wrapper" :id="sectionId">
      <div class="section-title" v-html="titre" />
    </div>
    <!-- Content Section - Single Column with Grid -->
    <div class="content-wrapper">
      <template v-if="schemaOnly">
        <div class="schema-grid">
          <svg class="schema-arrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <marker id="schema-arrow-head" markerWidth="2.5" markerHeight="2.5" refX="2" refY="1.25" orient="auto" markerUnits="userSpaceOnUse">
                <path d="M0,0 L2.5,1.25 L0,2.5 Z" fill="currentColor" />
              </marker>
            </defs>
            <path class="schema-arrow-path" d="M20 0 L20 100" marker-end="url(#schema-arrow-head)" />
            <path class="schema-arrow-path" d="M80 0 L80 100" marker-end="url(#schema-arrow-head)" />
            <path class="schema-arrow-path schema-arrow-path--link" d="M40 65 L50 65 L50 40" marker-end="url(#schema-arrow-head)" />
            <path class="schema-arrow-path schema-arrow-path--link" d="M50 35 L50 10 L58 10" marker-end="url(#schema-arrow-head)" />
          </svg>
          <div class="schema-column schema-column--left">
            <div
              v-for="(item, index) in schemaLeftItems"
              :key="`schema-left-${index}`"
              class="schema-card"
              :class="{ 'schema-card--no-number': !item.showNumber }"
            >
              <div class="schema-card-inner">
                <span v-if="item.showNumber" class="schema-number">{{ item.number }}</span>
                <div class="schema-content">
                  <h4 v-if="item.title" class="schema-title">{{ item.title }}</h4>
                  <div v-if="item.text" class="schema-text" v-html="item.text"></div>
                </div>
                <span
                  v-if="item.icon"
                  class="schema-icon"
                  :style="getIconStyle(item.icon)"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div class="schema-column schema-column--center">
            <div class="schema-note schema-note--center">
              <span class="schema-note-text">Défauts</span>
            </div>
          </div>
          <div class="schema-column schema-column--right">
            <div
              v-for="(item, index) in schemaRightItems"
              :key="`schema-right-${index}`"
              class="schema-card"
              :class="{ 'schema-card--no-number': !item.showNumber }"
            >
              <div class="schema-card-inner">
                <span v-if="item.showNumber" class="schema-number">{{ item.number }}</span>
                <div class="schema-content">
                  <h4 v-if="item.title" class="schema-title">{{ item.title }}</h4>
                  <div v-if="item.text" class="schema-text" v-html="item.text"></div>
                </div>
                <span
                  v-if="item.icon"
                  class="schema-icon"
                  :style="getIconStyle(item.icon)"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
          <div class="schema-note schema-note--left">
            <span class="schema-note-text">Aucuns défauts</span>
          </div>
          <div class="schema-note schema-note--right">
            <span class="schema-note-text">Aucuns défauts</span>
          </div>
          <div v-if="schemaFullItem" class="schema-card schema-card--full" :class="{ 'schema-card--no-number': !schemaFullItem.showNumber }">
            <div class="schema-card-inner">
              <span v-if="schemaFullItem.showNumber" class="schema-number">{{ schemaFullItem.number }}</span>
              <div class="schema-content">
                <h4 v-if="schemaFullItem.title" class="schema-title">{{ schemaFullItem.title }}</h4>
                <div v-if="schemaFullItem.text" class="schema-text" v-html="schemaFullItem.text"></div>
              </div>
              <span
                v-if="schemaFullItem.icon"
                class="schema-icon"
                :style="getIconStyle(schemaFullItem.icon)"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-else>
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
            :src="getImageUrl(block.content.image)"
            :alt="block.content?.alt || getImageFromUuid(block.content.image)?.alt || ''"
            class="column-image"
          />
          <div v-else-if="block.type === 'list' && block.content?.text" class="column-list" v-html="block.content.text"></div>
          <div v-else-if="block.type === 'features-grid' && block.content?.items" class="features-grid-wrapper">
            <div class="features-grid">
              <div
                v-for="(item, itemIdx) in block.content.items"
                :key="itemIdx"
                :class="['grid-item', { 'grid-item--no-number': !item.number || item.shownumber === 'false' }]"
                :style="getGridItemStyle(item)"
              >
                <template v-if="!item.number || item.shownumber === 'false'">
                  <span
                    v-if="resolveIconRef(item.icon)"
                    class="grid-item-icon"
                    :style="getIconStyle(item.icon)"
                    aria-hidden="true"
                  />
                  <div class="grid-item-content">
                    <h4 v-if="item.title" class="grid-item-title">{{ item.title }}</h4>
                    <p v-if="item.text" class="grid-item-text" v-html="item.text"></p>
                  </div>
                </template>
                <template v-else>
                  <span class="grid-item-number">{{ item.number }}</span>
                  <div class="grid-item-content">
                    <h4 v-if="item.title" class="grid-item-title">{{ item.title }}</h4>
                    <p v-if="item.text" class="grid-item-text" v-html="item.text"></p>
                  </div>
                  <span
                    v-if="resolveIconRef(item.icon)"
                    class="grid-item-icon"
                    :style="getIconStyle(item.icon)"
                    aria-hidden="true"
                  />
                </template>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCmsImage } from '@/composables/useCmsImage'

const props = defineProps<{
  titre?: string
  colonneGauche: any[]
  colonneDroite: any[]
  images: any[]
  sectionId?: string
  schemaOnly?: boolean
}>()

const { getCmsImageUrl } = useCmsImage(computed(() => props.images || []))

const schemaSteps = [1, 2, 3, 4, 5, 6, 7]

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

// Get proxied image URL from UUID
const getImageUrl = (uuid: string | string[]) => {
  const img = getImageFromUuid(uuid)
  if (!img) return ''
  const url = img.reg?.url || img.url
  return url ? getCmsImageUrl(url) : ''
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

const normalizeIconRef = (ref: string) => {
  if (ref.startsWith('file://') || ref.startsWith('/') || ref.startsWith('http')) {
    return ref
  }
  return `file://${ref}`
}

const normalizeSchemaItem = (item: any, fallbackNumber: number, forceShowNumber = false) => {
  const showNumber = forceShowNumber || item?.shownumber === 'true' || item?.shownumber === true
  return {
    number: item?.number || `${fallbackNumber}`,
    title: item?.title || '',
    text: item?.text || '',
    icon: item?.icon || null,
    showNumber
  }
}

const getIconStyle = (value: unknown) => {
  const ref = resolveIconRef(value)
  if (!ref) return {}
  const resolved = getCmsImageUrl(normalizeIconRef(ref))
  return {
    maskImage: `url(${resolved})`,
    WebkitMaskImage: `url(${resolved})`
  }
}

const getColorVar = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `var(--color-${color})`
  }
  return ''
}

const getGridItemStyle = (item: any) => {
  const style: Record<string, string> = {}
  const iconColor = getColorVar(item?.icon_color)
  if (iconColor) {
    style['--grid-item-icon-color'] = iconColor
  }
  const textColor = getColorVar(item?.text_color)
  if (textColor) {
    style['--grid-item-text-color'] = textColor
  }
  const backgroundColor = getColorVar(item?.background_color)
  if (backgroundColor) {
    style['--grid-item-bg-color'] = backgroundColor
  }
  return style
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

const schemaItems = computed(() => {
  const blocks = [...(props.colonneGauche || []), ...(props.colonneDroite || [])]
  const gridBlock = blocks.find((block: any) => block?.type === 'features-grid' && Array.isArray(block.content?.items))
  return gridBlock?.content?.items || []
})

const schemaItemsNormalized = computed(() => {
  if (!schemaItems.value.length) {
    return schemaSteps.map((step) => normalizeSchemaItem({ number: step }, step, true))
  }

  const normalized = schemaItems.value.slice(0, 7).map((item: any, index: number) => {
    return normalizeSchemaItem(item, index + 1)
  })

  if (normalized.length < 7) {
    for (let i = normalized.length; i < 7; i += 1) {
      normalized.push(normalizeSchemaItem({ number: i + 1 }, i + 1, true))
    }
  }

  return normalized
})

const schemaLeftItems = computed(() => schemaItemsNormalized.value.slice(0, 3))
const schemaRightItems = computed(() => schemaItemsNormalized.value.slice(3, 6))
const schemaFullItem = computed(() => schemaItemsNormalized.value[6] || null)

// Get grid column count from grid configuration
const getGridColumns = (columns: string): number => {
  if (columns === '2 colonnes') return 2
  if (columns === '3 colonnes') return 3
  if (columns === '4 colonnes') return 4
  return 2 // default
}
</script>

<style scoped lang="scss">
.section-wrapper {
  position: relative;
  margin: var(--space-xl) var(--page-gutter);
  padding: var(--space-xl) var(--page-gutter);
  border-radius: 32px;
  width: 100%;
  max-width: calc(100% - (var(--page-gutter) * 2));
  box-sizing: border-box;
  background: transparent;
}

.content-wrapper {
  max-width: var(--container-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.content-inner {
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

.features-grid-wrapper {
  width: 100%;
}

.schema-grid {
  display: grid;
  grid-template-columns: 1fr var(--schema-center-fr) 1fr;
  column-gap: var(--schema-gutter);
  row-gap: var(--space-l);
  width: 100%;
  position: relative;
  --schema-card-min-height: clamp(90px, 18vw, 130px);
  --schema-full-min-height: clamp(70px, 14vw, 100px);
  --schema-center-fr: 0.35fr;
  --schema-gutter: var(--space-s);
}

.schema-arrow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: var(--schema-full-min-height);
  width: 100%;
  height: calc(100% - var(--schema-full-min-height));
  pointer-events: none;
  color: var(--color-accent);
  z-index: 2;
}

.schema-arrow-path {
  stroke: currentColor;
  stroke-width: 2.5;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.6;
  vector-effect: non-scaling-stroke;
}

.schema-column {
  display: flex;
  flex-direction: column;
  gap: var(--space-l);
  position: relative;
  z-index: 3;
}

.schema-column--left {
  grid-column: 1 / 2;
}

.schema-column--center {
  grid-column: 2 / 3;
  align-items: center;
  justify-content: center;
}

.schema-column--right {
  grid-column: 3 / 4;
}

.schema-card {
  display: flex;
  align-items: stretch;
  justify-content: center;
  min-height: var(--schema-card-min-height);
  padding: clamp(0.5rem, 1.6vw, var(--space-m)) clamp(0.75rem, 2.4vw, var(--space-l));
  border-radius: var(--radius-m);
  background: #f9f9f9;
  border: 1px solid rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 3;
}

.schema-note {
  min-height: clamp(44px, 10vw, 60px);
  padding: clamp(0.35rem, 1.2vw, var(--space-s)) clamp(0.6rem, 2.2vw, var(--space-l));
  border-radius: var(--radius-m);
  background: var(--color-primary);
  border: 1px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 3;
}

.schema-note--center {
  width: 100%;
  max-width: 220px;
}

.schema-note.schema-note--left {
  grid-column: 1 / 2;
  justify-self: center;
  width: 70%;
  max-width: 320px;
  margin-top: 0;
  min-height: clamp(48px, 9vw, 70px);
  padding: var(--space-xs) var(--space-s);
}

.schema-note.schema-note--right {
  grid-column: 3 / 4;
  justify-self: center;
  width: 70%;
  max-width: 320px;
  margin-top: 0;
  min-height: clamp(48px, 9vw, 70px);
  padding: var(--space-xs) var(--space-s);
}

.schema-note-text {
  font-size: clamp(0.85rem, 2.4vw, 1.15rem);
  font-weight: 800;
  color: #fff;
  text-align: center;
}

.schema-card-inner {
  display: flex;
  gap: clamp(0.4rem, 1.4vw, var(--space-m));
  align-items: center;
  width: 100%;
}

.schema-card--no-number .schema-icon {
  order: -1;
}

.schema-card--full {
  grid-column: 1 / -1;
  min-height: var(--schema-full-min-height);
  padding: clamp(0.35rem, 1.2vw, var(--space-s)) clamp(0.6rem, 2.2vw, var(--space-l));
  background: var(--color-primary);
  border-color: transparent;
  margin-top: 0;
}

.schema-card--full .schema-card-inner {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.schema-card--full .schema-content {
  text-align: center;
  align-items: center;
  flex: 0 1 auto;
}

.schema-card--full .schema-number,
.schema-card--full .schema-title,
.schema-card--full .schema-text {
  color: #fff;
}

.schema-card--full .schema-text {
  opacity: 0.9;
}

.schema-card--full .schema-icon {
  background-color: #fff;
  margin-left: var(--space-m);
}

.schema-card--no-number {
  background: var(--color-primary);
  border-color: transparent;
}

.schema-card--no-number .schema-number,
.schema-card--no-number .schema-title,
.schema-card--no-number .schema-text {
  color: #fff;
}

.schema-card--no-number .schema-text {
  opacity: 0.9;
}

.schema-card--no-number .schema-icon {
  background-color: #fff;
}

.schema-number {
  font-size: clamp(1.6rem, 4.8vw, 3.2rem);
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1;
}

.schema-icon {
  display: inline-block;
  width: clamp(28px, 6vw, 48px);
  height: clamp(28px, 6vw, 48px);
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

.schema-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.schema-title {
  margin: 0;
  font-size: clamp(0.95rem, 2.8vw, 1.35rem);
  font-weight: 800;
  color: var(--color-primary);
  line-height: 1.3;
}

.schema-text {
  color: var(--color-dark);
  opacity: 0.85;
  line-height: 1.7;
  font-size: clamp(0.9rem, 2.6vw, 1.2rem);

  :deep(p) {
    margin: 0;
  }
}

.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: column;
  grid-template-rows: repeat(4, 1fr);
  gap: var(--space-l);
  width: 100%;
}

.grid-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  padding: var(--space-l);
  background: var(--grid-item-bg-color);
  gap: var(--space-l);
  border-radius: var(--radius-m);
  --grid-item-bg-color: #f9f9f9;
  --grid-item-text-color: var(--color-primary);
  --grid-item-icon-color: var(--color-accent);

  &.grid-item--no-number {
    --grid-item-bg-color: var(--color-primary);
    --grid-item-text-color: #fff;
    --grid-item-icon-color: #fff;
  }
}

.grid-item-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--grid-item-text-color);
  flex-shrink: 0;
  min-width: 80px;
  text-align: center;
}

.grid-item--no-number .grid-item-icon {
  min-width: 80px;
  width: 40px;
  height: 40px;
}

.grid-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.grid-item-icon {
  display: inline-block;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  background-color: var(--grid-item-icon-color);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  border-radius: 0;
}

.grid-item-title {
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0;
  color: var(--grid-item-text-color);
  line-height: 1.3;
}

.grid-item-text {
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
  line-height: 1.4;
  margin: 0;
  color: var(--grid-item-text-color);
  opacity: 0.9;
}

@media (max-width: 768px) {
  .section-wrapper {
    margin: var(--space-l) var(--page-gutter-mobile);
    padding: var(--space-l) var(--page-gutter-mobile);
    max-width: calc(100% - (var(--page-gutter-mobile) * 2));
  }

  .two-columns-inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: var(--space-m);
  }

  .schema-grid {
    grid-template-columns: minmax(0, 1fr) var(--schema-center-fr) minmax(0, 1fr);
    --schema-center-fr: 0.25fr;
    --schema-gutter: var(--space-xs);
    row-gap: var(--space-s);
  }

  .schema-column--left {
    grid-column: 1 / 2;
  }

  .schema-column--center {
    grid-column: 2 / 3;
  }

  .schema-column--right {
    grid-column: 3 / 4;
  }

  .schema-card-inner {
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .schema-number {
    order: 1;
  }

  .schema-icon {
    order: 2;
    margin-left: auto;
  }

  .schema-content {
    order: 3;
    flex-basis: 100%;
  }

  .schema-card--no-number .schema-icon {
    order: 1;
    margin-left: 0;
  }

  .schema-card--no-number .schema-content {
    order: 2;
  }

  .schema-card--full {
    margin-top: var(--space-l);
  }


  .schema-note--center {
    margin-block: var(--space-m);
    width: 100%;
    max-width: clamp(140px, 45vw, 200px);
  }

  .schema-note.schema-note--left {
    grid-column: 1 / 2;
    margin-block: var(--space-m);
    width: 80%;
    max-width: clamp(80px, 30vw,160px);
    min-height: clamp(40px, 12vw, 56px);
    padding: var(--space-xxs) var(--space-xs);
  }

  .schema-note.schema-note--right {
    grid-column: 3 / 4;
    margin-block: var(--space-m);
    width: 80%;
    max-width: clamp(80px, 30vw,160px);
    min-height: clamp(40px, 12vw, 56px);
    padding: var(--space-xxs) var(--space-xs);
  }
}
</style>
