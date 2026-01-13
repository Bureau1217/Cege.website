<template>
  <StyleBlock variant="primary">
    <div v-if="titre" class="section-title-wrapper" :id="sectionId">
      <div class="section-title" v-html="titre" />
    </div>
    <!-- Content Section - Two Columns -->
    <div class="content-inner">
      <div class="column column-left">
        <template v-for="(item, index) in blocks" :key="`left-${index}`">
          <component
            :is="getHeadingTag(item.content?.level)"
            v-if="item && item.type === 'heading' && item.content?.text"
            class="column-heading"
            :class="getHeadingColorClass(item.content?.color)"
          >
            {{ item.content.text }}
          </component>
          <div
            v-else-if="item && item.type === 'text' && item.content?.text"
            class="column-text"
            :class="getTextColorClass(item.content?.color)"
            v-html="item.content.text"
          ></div>
        </template>
        <div class="contact-cards">
          <template v-for="(item, index) in blocks" :key="`contact-${index}`">
            <BlockContactInfo
              v-if="item?.type === 'contact-info'"
              :block="item"
              :files="files"
            />
          </template>
        </div>
      </div>
      <div class="column column-right">
        <template v-for="(item, index) in blocks" :key="`form-${index}`">
          <BlockContactForm
            v-if="item?.type === 'contact-form'"
            :block="item"
          />
        </template>
      </div>
    </div>
  </StyleBlock>
</template>

<script setup lang="ts">
import StyleBlock from './StyleBlock.vue'
import BlockContactInfo from '@/components/BlockContactInfo.vue'
import BlockContactForm from '@/components/BlockContactForm.vue'

const props = defineProps<{
  titre?: string
  blocks: any[]
  files?: any[]
  sectionId?: string
}>()

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
  return 'color-neutral'
}

const getTextColorClass = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `color-${color}`
  }
  return 'color-neutral'
}
</script>

<style scoped lang="scss">
.section-title {
  color: white;
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

.column-left {
  gap: var(--space-xl);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.column-left .contact-cards {
  margin-top: auto;
}

.column-right {
  gap: var(--space-l);
}

.contact-cards {
  width: 100%;
}

.column-text {
  font-size: var(--text-base-size);
  line-height: 1.6;
  color: var(--color-neutral);
  opacity: 0.9;
  font-weight: var(--text-base-weight);

  :deep(p) {
    margin: 0 0 var(--space-m) 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    margin: 0;
    padding-left: 1.5rem;

    li {
      margin-bottom: var(--space-m);

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

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
}

</style>
