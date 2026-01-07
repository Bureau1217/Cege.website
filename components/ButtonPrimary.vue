<template>
  <a :href="href" class="button-primary">
    <slot>{{ label }}</slot>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string
  label?: string
}>()
</script>

<style scoped lang="scss">
.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-m) var(--space-xl);
  background-color: var(--color-primary);
  color: var(--color-neutral);
  font-weight: 700;
  font-size: 1rem;
  border-radius: var(--radius-m);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 10px 30px rgba(24, 0, 158, 0.2);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(24, 0, 158, 0.3);
  }

  &:active {
    transform: translateY(-2px);
  }
}
</style>
