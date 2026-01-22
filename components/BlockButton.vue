<template>
  <div class="block-button" :style="{ justifyContent: getAlign() }">
    <a
      v-if="content?.text && (content?.link || content?.url)"
      :href="content.link || content.url"
      :target="content.target || '_self'"
      :class="['button', `button--${getVariant()}`, { 'button--review': isReviewButton }]"
      :style="getButtonStyle()"
    >
      {{ content.text }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  block: any
}>()

const content = computed(() => props.block.content || props.block)

const isReviewButton = computed(() => {
  const text = String(content.value?.text || '').trim().toLowerCase()
  return text === 'laisser un avis' || text.startsWith('laisser un avis')
})

const getColorVar = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `var(--color-${color})`
  }
  return ''
}

const getButtonStyle = () => {
  const style: Record<string, string> = {}
  const color = getColorVar(content.value?.color)
  if (!color) return style

  style['--button-color'] = color
  style['--button-border-color'] = color
  style['--button-hover-text-color'] = color

  if (content.value?.color === 'neutral') {
    style['--button-text-color'] = 'var(--color-dark)'
    style['--button-border-color'] = 'var(--color-dark)'
    style['--button-hover-text-color'] = 'var(--color-dark)'
    style['--button-hover-bg'] = 'var(--color-neutral)'
  } else {
    style['--button-text-color'] = 'var(--color-neutral)'
  }

  return style
}

const getVariant = () => {
  const style = content.value?.style || content.value?.variant
  if (style === 'outline') return 'outline'
  if (style === 'secondary') return 'outline'
  return 'primary'
}

const getAlign = () => {
  const align = content.value?.align
  if (align === 'left') return 'flex-start'
  if (align === 'right') return 'flex-end'
  return 'center'
}
</script>

<style scoped lang="scss">
.block-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--space-xl) 0;
  width: 100%;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-s) var(--space-l);
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;

  &--primary {
    background-color: var(--button-color, var(--color-accent));
    color: var(--button-text-color, #fff);
    border: 2px solid var(--button-border-color, var(--button-color, var(--color-accent)));

    &:hover {
      background-color: var(--button-color, var(--color-accent));
      color: var(--button-text-color, #fff);
      border: 2px solid var(--button-border-color, var(--button-color, var(--color-accent)));
      opacity: 0.9;
    }
  }

  &--outline {
    background-color: transparent;
    color: var(--button-color, var(--color-accent));
    border: 2px solid var(--button-border-color, var(--button-color, var(--color-accent)));

    &:hover {
      background-color: var(--button-color, var(--color-accent));
      color: var(--button-text-color, #fff);
    }
  }

  &--review:hover {
    background-color: var(--button-hover-bg, #fff);
    color: var(--button-hover-text-color, var(--button-color, var(--color-accent)));
    border-color: var(--button-border-color, var(--button-color, var(--color-accent)));
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .block-button {
    margin: 0;
  }

  .button {
    padding: var(--space-s) var(--space-l);
    font-size: 0.95rem;
  }
}
</style>
