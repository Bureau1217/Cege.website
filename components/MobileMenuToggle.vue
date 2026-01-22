<template>
  <button
    class="mobile-menu-toggle"
    type="button"
    :class="{ 'is-open': isOpen }"
    @click="isOpen = !isOpen"
  >
    <span class="line" />
    <span class="line" />
    <span class="line" />
  </button>
</template>

<script setup lang="ts">
const isOpen = useState('mobileMenuOpen', () => false)
</script>

<style scoped lang="scss">
.mobile-menu-toggle {
  display: none;
  border: 0;
  background: transparent;
  padding: 8px;
  cursor: pointer;
  flex-direction: column;
  gap: 5px;
}

.line {
  display: block;
  width: 26px;
  height: 2px;
  background: var(--color-primary);
  border-radius: 2px;
  transition: transform 0.2s ease, opacity 0.2s ease, background 0.2s ease;
}

.is-open .line {
  background: var(--color-primary);
}

.is-open .line:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.is-open .line:nth-child(2) {
  opacity: 0;
}

.is-open .line:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: flex;
  }
}
</style>
