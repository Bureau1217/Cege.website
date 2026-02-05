<template>
  <div v-show="isOpen" class="mobile-menu">
    <ul class="menu-list">
      <li v-for="item in items" :key="item.to">
        <NuxtLink :to="item.to" class="menu-link" @click="isOpen = false">
          {{ item.label }}
        </NuxtLink>
      </li>
    </ul>

    <div v-if="footerData" class="menu-footer">
      <div v-if="footerData.adresse" class="footer-item">
        <span
          v-if="footerIcons?.adresse?.url"
          class="footer-icon"
          :style="getIconStyle(footerIcons.adresse.url)"
        />
        <div class="footer-text" v-html="footerData.adresse" />
      </div>

      <div v-if="footerData.telephone" class="footer-item">
        <span
          v-if="footerIcons?.telephone?.url"
          class="footer-icon"
          :style="getIconStyle(footerIcons.telephone.url)"
        />
        <div class="footer-text">
          <a :href="`tel:${footerData.telephone}`">{{ footerData.telephone }}</a>
        </div>
      </div>

      <div v-if="footerData.email" class="footer-item">
        <span
          v-if="footerIcons?.email?.url"
          class="footer-icon"
          :style="getIconStyle(footerIcons.email.url)"
        />
        <div class="footer-text">
          <a :href="`mailto:${footerData.email}`">{{ footerData.email }}</a>
        </div>
      </div>

      <div v-if="footerData.horaires" class="footer-item">
        <span
          v-if="footerIcons?.horaires?.url"
          class="footer-icon"
          :style="getIconStyle(footerIcons.horaires.url)"
        />
        <div class="footer-text" v-html="footerData.horaires" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ to: string; label: string }>
  footerData?: any
  footerIcons?: any
  getIconStyle: (url: string) => Record<string, string>
}>()

const isOpen = useState('mobileMenuOpen', () => false)

const route = useRoute()
watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>

<style scoped lang="scss">
.mobile-menu {
  display: none;
  background: var(--color-primary);
  padding: var(--space-l) calc(var(--page-gutter-mobile) * 2);
  padding-bottom: calc(var(--space-l) + env(safe-area-inset-bottom, 0px));
  flex-direction: column;
  gap: var(--space-l);
  min-height: calc(100vh - 60px);
  min-height: calc(100dvh - 60px);
  margin-top: 0;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.menu-link {
  display: block;
  font-size: 2rem;
  padding: 2px 0;
  color: white;
  text-decoration: none;
  font-weight: 500;

  &:hover {
    opacity: 0.8;
  }
}

.menu-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
}

.footer-item {
  display: flex;
  gap: var(--space-s);
  align-items: flex-start;
  padding: var(--space-m);
  border-radius: var(--radius-m);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: white;
}

.footer-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background-color: var(--color-accent);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.footer-text {
  font-size: 0.9rem;
  line-height: 1.5;

  a {
    color: inherit;
    text-decoration: none;
  }
}

@media (max-width: 768px) {
  .mobile-menu {
    display: flex;
  }
}
</style>
