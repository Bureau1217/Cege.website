<template>
  <StyleBlock :variant="variant">
    <div v-if="showTitle" class="section-title-wrapper">
      <div
        v-if="titre"
        class="section-title"
        :class="titleClass"
        v-html="titre"
      />
    </div>
    <div v-if="isSplit" class="section-split">
      <div class="section-left">
        <div
          v-if="titre"
          class="section-title section-title-left"
          :class="titleClass"
          v-html="titre"
        />
        <div
          v-if="introText"
          class="section-intro"
          :class="introClass"
          v-html="introHtml"
        />
      </div>
      <div class="section-right">
        <div class="section-content">
          <component
            v-for="(block, idx) in blocks"
            :key="block.id || idx"
            :is="getBlockComponent(block.type)"
            :block="block"
          />
        </div>
      </div>
    </div>
    <div v-else class="section-content">
      <component
        v-for="(block, idx) in blocks"
        :key="block.id || idx"
        :is="getBlockComponent(block.type)"
        :block="block"
      />
    </div>
  </StyleBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StyleBlock from './StyleBlock.vue'
import BlockHeading from '@/components/BlockHeading.vue'
import BlockText from '@/components/BlockText.vue'
import BlockContactForm from '@/components/BlockContactForm.vue'

const props = withDefaults(defineProps<{
  titre?: string
  blocks: any[]
  variant?: 'white' | 'primary' | 'transparent'
  layout?: 'stack' | 'split'
  introText?: string
}>(), {
  variant: 'primary',
  layout: 'stack'
})

const isSplit = computed(() => props.layout === 'split')
const showTitle = computed(() => !isSplit.value)

const titleClass = computed(() => {
  return props.variant === 'white' ? 'section-title-primary' : 'section-title-inverse'
})

const introClass = computed(() => {
  return props.variant === 'white' ? 'section-intro-primary' : 'section-intro-inverse'
})

const introHtml = computed(() => {
  if (!props.introText) return ''
  return props.introText.trim()
})

const getBlockComponent = (type: string) => {
  const componentMap: Record<string, any> = {
    'heading': BlockHeading,
    'text': BlockText,
    'contact-form': BlockContactForm,
  }
  return componentMap[type] || 'div'
}
</script>

<style scoped lang="scss">
.section-title-left {
  margin: 0 0 var(--space-l) 0;
  max-width: none;
}

.section-title-inverse {
  color: white;
}

.section-title-primary {
  color: var(--color-primary);
  opacity: 1;
}

.section-split {
  max-width: var(--container-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxxl);
  align-items: start;
}

.section-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.section-intro {
  margin: 0;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.section-intro :deep(h2),
.section-intro :deep(h3),
.section-intro :deep(h4) {
  margin: 0 0 var(--space-m) 0;
  line-height: 1.2;
}

.section-intro :deep(p) {
  margin: 0 0 var(--space-m) 0;
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
  line-height: 1.8;
}

.section-intro :deep(p:last-child) {
  margin-bottom: 0;
}

.section-intro :deep(ul),
.section-intro :deep(ol) {
  margin: 0 0 var(--space-m) 1.5rem;
  padding: 0;
}

.section-intro :deep(li) {
  margin-bottom: var(--space-xs);
}

.section-intro-inverse {
  color: white;
  opacity: 0.9;
}

.section-intro-primary {
  color: var(--color-primary);
  opacity: 0.9;
}

.section-content {
  max-width: var(--container-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.section-split .section-content {
  max-width: none;
  margin: 0;
}

@media (max-width: 768px) {
  .section-split {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}
</style>
