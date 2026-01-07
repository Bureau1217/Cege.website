<template>
  <section
    class="v-style-block"
    :class="[
      `variant-${variant}`,
      { 'is-fill': isFill }
    ]"
  >
    <div
      v-if="withDivider"
      class="v-style-block__divider"
      :class="[`is-${dividerPosition}`, { 'is-short': isShortDivider }]"
    />
    <slot />
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'white' | 'primary' | 'transparent'
    withDivider?: boolean
    isFill?: boolean
    dividerPosition?: 'center' | 'leftSplit'
    isShortDivider?: boolean
  }>(),
  {
    variant: 'transparent'
  }
)
</script>

<style scoped lang="scss">
.v-style-block {
  position: relative;
  margin: var(--space-xl) var(--page-gutter);
  padding: var(--space-xxxl) var(--page-gutter);
  border-radius: 32px;
  width: 100%;
  max-width: calc(100% - (var(--page-gutter) * 2));
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin: var(--space-l) var(--page-gutter-mobile);
    padding: var(--space-l) var(--page-gutter-mobile);
    max-width: calc(100% - (var(--page-gutter-mobile) * 2));
  }
}

// Variantes de couleur
.v-style-block.variant-white {
  background: white;
}

.v-style-block.variant-primary {
  background: var(--color-primary);
}

.v-style-block.variant-transparent {
  background: transparent;
}

.v-style-block.is-fill {
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0;
  margin-right: 0;
}

.v-style-block__divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0.05rem;
  background-color: var(--color-accent);
  z-index: 1;
  pointer-events: none;

  &.is-center {
    left: 50%;
    transform: translateX(-50%);
  }

  &.is-leftSplit {
    left: calc(100% * 4 / 6);
    transform: translateX(-50%);
  }

  @media (max-width: 900px) {
    display: none;
  }
}

.v-style-block__divider.is-short {
  top: 5%;
  bottom: 5%;
}
</style>
