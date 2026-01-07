<template>
  <div class="block-feature-item">
    <div
      v-for="(item, index) in block.content.items"
      :key="index"
      class="feature-item"
      :class="[
        `icon-${item.iconposition || 'left'}`,
        `align-${item.alignment || 'left'}`
      ]"
    >
      <div
        v-if="item.icon && item.icon.length > 0"
        class="feature-icon"
        :style="getIconStyle(item.icon)"
        aria-hidden="true"
      ></div>

      <div class="feature-content">
        <div v-if="item.shownumber === 'true' && item.number" class="feature-number">
          {{ item.number }}
        </div>
        <h4 v-if="item.title" class="feature-title">{{ item.title }}</h4>
        <p v-if="item.text" class="feature-text">{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  block: CMS_Block_FeatureItem
}>()

const { getCmsImageUrl } = useCmsImage()

const resolveIconRef = (value: unknown) => {
  if (!value) return null
  if (Array.isArray(value)) return resolveIconRef(value[0])
  if (typeof value === 'string') return value
  if (typeof value === 'object') {
    const icon = value as { uuid?: string; url?: string }
    if (icon.url) return icon.url
    if (icon.uuid) return `file://${icon.uuid}`
  }
  return null
}

const getIconStyle = (value: unknown) => {
  const ref = resolveIconRef(value)
  if (!ref) return {}
  const resolved = getCmsImageUrl(ref)
  return {
    maskImage: `url(${resolved})`,
    WebkitMaskImage: `url(${resolved})`
  }
}
</script>

<style scoped lang="scss">
.block-feature-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  margin-bottom: var(--space-xxl);
}

.feature-item {
  display: flex;
  gap: var(--space-xl);
  align-items: flex-start;
  padding: var(--space-l);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.03));
  border-radius: var(--radius-l);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

  &:hover {
    transform: translateX(8px);
    box-shadow: 0 12px 30px rgba(24, 0, 158, 0.1);
    border-color: rgba(24, 0, 158, 0.1);
  }

  &.icon-right {
    flex-direction: row-reverse;

    &:hover {
      transform: translateX(-8px);
    }
  }

  &.icon-left {
    flex-direction: row;
  }

  &.align-center {
    align-items: center;
    text-align: center;
    flex-direction: column;

    &:hover {
      transform: translateY(-4px);
    }
  }
}

.feature-icon {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  transition: all 0.4s ease;
  filter: drop-shadow(0 4px 12px rgba(24, 0, 158, 0.1));
  background-color: var(--color-accent);
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;

  .feature-item:hover & {
    transform: scale(1.15);
    filter: drop-shadow(0 6px 18px rgba(24, 0, 158, 0.2));
  }
}

.feature-content {
  flex: 1;
  min-width: 0;
}

.feature-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--color-neutral);
  border-radius: 50%;
  font-weight: 800;
  font-size: 1.25rem;
  margin-bottom: var(--space-m);
  box-shadow: 0 8px 20px rgba(24, 0, 158, 0.2);
  transition: all 0.3s ease;

  .feature-item:hover & {
    transform: scale(1.15) rotate(-5deg);
    box-shadow: 0 12px 30px rgba(24, 0, 158, 0.3);
  }
}

.feature-title {
  font-size: 1.1875rem;
  font-weight: 700;
  margin-bottom: var(--space-s);
  color: var(--color-dark);
  line-height: 1.3;
  transition: color 0.3s ease;

  .feature-item:hover & {
    color: var(--color-primary);
  }
}

.feature-text {
  color: var(--color-dark);
  opacity: 0.8;
  line-height: 1.8;
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
}

@media (max-width: 768px) {
  .feature-item {
    flex-direction: column !important;
    align-items: center;
    text-align: center;
    gap: var(--space-m);
    padding: var(--space-m);

    &:hover {
      transform: translateY(-4px);
    }

    &.icon-right {
      flex-direction: column !important;
    }
  }

  .feature-icon {
    width: 60px;
    height: 60px;
  }

  .feature-title {
    font-size: 1.0625rem;
  }

  .feature-text {
    font-size: var(--text-small-size);
  }
}

@media (max-width: 480px) {
  .block-feature-item {
    gap: var(--space-m);
  }

  .feature-item {
    padding: var(--space-m);
    gap: var(--space-m);
  }

  .feature-icon {
    width: 50px;
    height: 50px;
  }

  .feature-number {
    width: 40px;
    height: 40px;
    font-size: 1.05rem;
  }

  .feature-title {
    font-size: 1rem;
  }

  .feature-text {
    font-size: 0.95rem;
  }
}
</style>
