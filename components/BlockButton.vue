<template>
  <div class="block-button" :style="{ justifyContent: getAlign() }">
    <a
      v-if="content?.text && (content?.link || content?.url)"
      :href="content.link || content.url"
      :target="content.target || '_self'"
      :class="['button', `button--${getVariant()}`]"
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
    background-color: var(--color-accent);
    color: #fff;
    border: 2px solid var(--color-accent);

    &:hover {
      background-color: var(--color-accent);
      color: #fff;
      border: 2px solid var(--color-accent);
      opacity: 0.9;
    }
  }

  &--outline {
    background-color: transparent;
    color: var(--color-accent);
    border: 2px solid var(--color-accent);

    &:hover {
      background-color: var(--color-accent);
      color: white;
    }
  }
}

@media (max-width: 768px) {
  .button {
    padding: var(--space-s) var(--space-l);
    font-size: 0.95rem;
  }
}
</style>
