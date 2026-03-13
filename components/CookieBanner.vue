<template>
  <transition name="cookie-slide">
    <div
      v-if="shouldShow"
      class="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Cookies"
    >
      <div class="cookie-banner__content">
        <div class="cookie-banner__text" v-html="messageHtml" />
        <div class="cookie-banner__actions">
          <a
            v-if="policyUrl"
            class="cookie-banner__link"
            :href="policyUrl"
            rel="noopener"
          >
            {{ policyLabel }}
          </a>
          <button
            type="button"
            class="cookie-banner__button"
            @click="accept"
          >
            {{ acceptLabel }}
          </button>
          <button
            v-if="declineLabel"
            type="button"
            class="cookie-banner__button is-secondary"
            @click="decline"
          >
            {{ declineLabel }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const { siteData } = await useSiteSettings()
const consent = useCookie<string | null>('cege_cookie_consent', {
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 90 // 90 jours
})

const isVisible = ref(false)

onMounted(() => {
  if (!consent.value) {
    isVisible.value = true
  }
})

const settings = computed(() => siteData.value?.result || {})

const isEnabled = computed(() => {
  const value = settings.value.cookieBannerEnabled
  if (value === undefined || value === null || value === '') return true
  if (typeof value === 'boolean') return value
  return value === 'true' || value === '1'
})

const messageHtml = computed(() => {
  return settings.value.cookieBannerText || 'Nous utilisons des cookies pour ameliorer votre experience.'
})

const acceptLabel = computed(() => {
  return settings.value.cookieBannerAcceptLabel || 'Accepter'
})

const declineLabel = computed(() => {
  return settings.value.cookieBannerDeclineLabel || 'Refuser'
})

const policyLabel = computed(() => {
  return settings.value.cookieBannerLinkLabel || 'Politique de confidentialite'
})

const policyUrl = computed(() => {
  return settings.value.cookieBannerLinkUrl || ''
})

const shouldShow = computed(() => {
  return isEnabled.value && isVisible.value
})

const accept = () => {
  consent.value = 'accepted'
  isVisible.value = false
}

const decline = () => {
  consent.value = 'declined'
  isVisible.value = false
}
</script>

<style scoped lang="scss">
.cookie-banner {
  position: fixed;
  left: var(--space-l);
  right: var(--space-l);
  bottom: var(--space-l);
  background: var(--color-neutral);
  color: var(--color-primary);
  border-radius: var(--radius-m);
  border: 1px solid rgba(24, 0, 158, 0.12);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  padding: var(--space-l) var(--space-xl);
  z-index: 2000;
}

.cookie-banner__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
}

.cookie-banner__text {
  flex: 1;
  line-height: 1.7;
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);

  :deep(p) {
    margin: 0;
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;
  }
}

.cookie-banner__actions {
  display: flex;
  align-items: center;
  gap: var(--space-m);
  flex-shrink: 0;
}

.cookie-banner__link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: underline;
}

.cookie-banner__button {
  padding: var(--space-s) var(--space-l);
  border-radius: 999px;
  border: 2px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.85;
  }

  &.is-secondary {
    background: transparent;
    color: var(--color-primary);
  }
}

.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition: transform 0.25s ease, opacity 0.25s ease;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

@media (max-width: 768px) {
  .cookie-banner {
    left: var(--space-m);
    right: var(--space-m);
    bottom: var(--space-m);
  }

  .cookie-banner__content {
    flex-direction: column;
    align-items: flex-start;
  }

  .cookie-banner__actions {
    width: 100%;
    flex-wrap: wrap;
  }
}
</style>
