<template>
  <StyleBlock :variant="variant">
    <div v-if="titre" class="section-title-wrapper" :id="sectionId">
      <div class="section-title" v-html="titre" />
    </div>
    <!-- Content Section -->
    <div class="content-wrapper">
      <template v-for="(block, index) in blocks" :key="index">
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
        <component
          v-else
          :is="getBlockComponent(block.type)"
          v-bind="getBlockProps(block)"
        />
      </template>
    </div>
  </StyleBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StyleBlock from './StyleBlock.vue'
import BlockHeading from '@/components/BlockHeading.vue'
import BlockText from '@/components/BlockText.vue'
import BlockImage from '@/components/BlockImage.vue'
import BlockFeatureItem from '@/components/BlockFeatureItem.vue'
import BlockFeaturesGrid from '@/components/BlockFeaturesGrid.vue'
import BlockTestimonials from '@/components/BlockTestimonials.vue'
import BlockContactInfo from '@/components/BlockContactInfo.vue'
import BlockContactForm from '@/components/BlockContactForm.vue'
import BlockButton from '@/components/BlockButton.vue'

const props = withDefaults(
  defineProps<{
    titre?: string
    blocks: any[]
    files?: any[]
    sectionId?: string
    variant?: 'white' | 'primary' | 'transparent'
  }>(),
  {
    variant: 'transparent'
  }
)

const getBlockComponent = (type: string) => {
  const componentMap: Record<string, any> = {
    'heading': BlockHeading,
    'text': BlockText,
    'image': BlockImage,
    'feature-item': BlockFeatureItem,
    'features-grid': BlockFeaturesGrid,
    'testimonials': BlockTestimonials,
    'contact-info': BlockContactInfo,
    'contact-form': BlockContactForm,
    'button': BlockButton,
  }
  return componentMap[type] || 'div'
}

const getBlockProps = (block: any) => {
  const withFiles = ['image', 'feature-item', 'features-grid', 'contact-info']
  if (withFiles.includes(block.type)) {
    return { block, files: props.files }
  }
  return { block }
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
.section-title {
  color: var(--color-primary);
}

.content-wrapper {
  max-width: var(--container-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.column-text {
  font-size: var(--text-base-size);
  line-height: 1.6;
  color: var(--color-dark);
  opacity: 0.85;
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
