<template>
  <div
    class="block-features-grid"
    :class="[
      `cols-${getColumnCount()}`,
      `gap-${block.content.gap || 'medium'}`
    ]"
  >
    <div
      v-for="(item, index) in block.content.items"
      :key="index"
      class="grid-item"
    >
      <div v-if="item.shownumber === 'true' && item.number" class="item-number">
        {{ item.number }}
      </div>
      <div v-if="item.icon && item.icon.length > 0" class="item-icon">
        <img :src="getFileUrl(item.icon[0])" :alt="item.title || ''" />
      </div>
      <h4 v-if="item.title" class="item-title">{{ item.title }}</h4>
      <p v-if="item.text" class="item-text">{{ item.text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  block: CMS_Block_FeaturesGrid
}>()

const { getCmsImageUrl } = useCmsImage()

const getColumnCount = () => {
  const cols = props.block.content.columns
  if (cols === '2 colonnes') return '2'
  if (cols === '3 colonnes') return '3'
  if (cols === '4 colonnes') return '4'
  return '3'
}

const getFileUrl = (fileId: string) => {
  return getCmsImageUrl(fileId)
}
</script>

<style scoped lang="scss">
.block-features-grid {
  display: grid;
  margin-block: var(--space-xxl);

  &.cols-2 {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  &.cols-3 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  &.cols-4 {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  &.gap-small {
    gap: var(--space-m);
  }

  &.gap-medium {
    gap: var(--space-l);
  }

  &.gap-large {
    gap: var(--space-xl);
  }
}

.grid-item {
  padding: var(--space-xl);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.04));
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-l);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
    border-color: rgba(0, 0, 0, 0.1);
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.06));

    &::before {
      left: 100%;
    }

    .item-icon {
      transform: scale(1.1) translateY(-4px);
    }

    .item-title {
      color: var(--color-primary);
    }
  }
}

.item-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: var(--color-neutral);
  border-radius: 50%;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: var(--space-m);
  box-shadow: 0 8px 20px rgba(24, 0, 158, 0.2);
  transition: all 0.3s ease;

  .grid-item:hover & {
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 12px 30px rgba(24, 0, 158, 0.3);
  }
}

.item-icon {
  width: 70px;
  height: 70px;
  margin-inline: auto;
  margin-bottom: var(--space-m);
  transition: all 0.4s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(24, 0, 158, 0.1));
  }
}

.item-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: var(--space-s);
  color: var(--color-dark);
  transition: color 0.3s ease;
  line-height: 1.3;
}

.item-text {
  color: var(--color-dark);
  opacity: 0.75;
  line-height: 1.8;
  font-size: var(--text-small-size);
  font-weight: var(--text-small-weight);
  margin: 0;
}

@media (max-width: 768px) {
  .block-features-grid {
    &.cols-3,
    &.cols-4 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .grid-item {
    padding: var(--space-l);
  }

  .item-icon {
    width: 60px;
    height: 60px;
  }

  .item-title {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .block-features-grid {
    grid-template-columns: 1fr;
    gap: var(--space-m);
  }

  .grid-item {
    padding: var(--space-m);
  }

  .item-icon {
    width: 50px;
    height: 50px;
  }

  .item-title {
    font-size: 0.95rem;
  }

  .item-text {
    font-size: 0.95rem;
  }
}
</style>
