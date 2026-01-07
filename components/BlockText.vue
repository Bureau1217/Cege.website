<template>
  <div
    class="block-text"
    :class="[
      `align-${block.content.align || 'left'}`,
      getTextColorClass(block.content?.color)
    ]"
  >
    <div class="block-text-content" v-html="block.content.text" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  block: CMS_Block_Text
}>()

const getTextColorClass = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `color-${color}`
  }
  return 'color-dark'
}
</script>

<style scoped lang="scss">
.block-text {
  margin-bottom: var(--space-xl);
  color: var(--color-dark);

  &.align-left {
    text-align: left;
  }

  &.align-center {
    text-align: center;
  }

  &.align-right {
    text-align: right;
  }

  .block-text-content {
    max-width: 65ch;
    line-height: 1.6;
    font-size: var(--text-base-size);
    font-weight: var(--text-base-weight);
    color: inherit;
    opacity: 0.85;
    letter-spacing: 0.3px;
  }

  :deep(p) {
    margin: 0 0 var(--space-m) 0;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--space-m) 1.5rem;
    padding: 0;
  }

  :deep(li) {
    margin-bottom: var(--space-xs);
  }

  :deep(a) {
    color: currentColor;
    text-decoration: underline;
  }

  &.align-center .block-text-content {
    margin-inline: auto;
    opacity: 0.9;
  }

  &.align-right .block-text-content {
    margin-left: auto;
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

@media (max-width: 768px) {
  .block-text {
    .block-text-content {
      font-size: var(--text-small-size);
      line-height: 1.6;
    }
  }
}

@media (max-width: 480px) {
  .block-text {
    .block-text-content {
      font-size: 0.95rem;
    }
  }
}
</style>
