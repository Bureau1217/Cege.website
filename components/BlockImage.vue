<template>
  <div
    class="block-image"
    :class="[
      `size-${block.content.size || 'medium'}`,
      `align-${block.content.align || 'center'}`
    ]"
  >
    <img v-if="imageUrl" :src="imageUrl" :alt="imageAlt" />
    <p v-if="block.content.caption" class="image-caption">{{ block.content.caption }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  block: CMS_Block_Image
}>()

const { getCmsImageUrl } = useCmsImage()

const resolveImageRef = (value: unknown) => {
  if (!value) return null
  if (Array.isArray(value)) return value[0] || null
  if (typeof value === 'string') return value
  return null
}

const imageRef = computed(() => resolveImageRef(props.block.content.image))

const imageUrl = computed(() => {
  if (!imageRef.value) return null
  return getCmsImageUrl(imageRef.value)
})

const imageAlt = computed(() => {
  return props.block.content.alt || props.block.content.caption || ''
})
</script>

<style scoped lang="scss">
.block-image {
  margin-block: var(--space-xxl);

  img {
    border-radius: var(--radius-l);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
    transition: all 0.4s ease;
    display: block;

    &:hover {
      box-shadow: 0 20px 50px rgba(24, 0, 158, 0.15);
      transform: translateY(-4px);
    }
  }

  &.size-small img {
    max-width: 400px;
  }

  &.size-medium img {
    max-width: 700px;
  }

  &.size-large img {
    max-width: 100%;
  }

  &.align-center {
    text-align: center;
    img {
      margin-inline: auto;
    }
  }

  &.align-left {
    text-align: left;
  }

  &.align-right {
    text-align: right;
    img {
      margin-left: auto;
      margin-right: 0;
    }
  }
}

.image-caption {
  margin-top: var(--space-m);
  font-size: 0.875rem;
  opacity: 0.7;
  font-style: italic;
  text-align: center;
  color: var(--color-dark);
  line-height: 1.6;

  .block-image.align-left & {
    text-align: left;
  }

  .block-image.align-right & {
    text-align: right;
  }
}

@media (max-width: 768px) {
  .block-image {
    margin-block: var(--space-xl);

    &.size-small img,
    &.size-medium img {
      max-width: 100%;
    }
  }
}
</style>
