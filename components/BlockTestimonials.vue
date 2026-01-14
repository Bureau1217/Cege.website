<template>
  <div class="block-testimonials">
    <h3 v-if="block.content.title" class="testimonials-title">{{ block.content.title }}</h3>

    <div class="testimonials-grid">
      <div
        v-for="(testimonial, index) in block.content.testimonials"
        :key="index"
        class="testimonial-card"
      >
        <div class="testimonial-rating" v-if="testimonial.rating">
          <span v-for="star in testimonial.rating" :key="star" class="star">★</span>
        </div>
        <p class="testimonial-comment">"{{ testimonial.comment }}"</p>
        <div class="testimonial-author">
          <strong>{{ testimonial.name }}</strong>
          <span v-if="testimonial.role"> - {{ testimonial.role }}</span>
        </div>
        <div v-if="testimonial.date" class="testimonial-date">{{ testimonial.date }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  block: CMS_Block_Testimonials
}>()

</script>

<style scoped lang="scss">
.block-testimonials {
  margin-block: var(--space-xxl);
  position: relative;
}

.testimonials-title {
  text-align: center;
  margin-bottom: var(--space-xxl);
  font-size: clamp(1.875rem, 4.5vw, 2.75rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.testimonials-grid {
  display: grid;
  gap: var(--space-xl);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.testimonial-card {
  padding: var(--space-xl);
  background: linear-gradient(135deg, var(--color-neutral), rgba(0, 0, 0, 0.02));
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: var(--radius-m);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.06);
  }
}

.testimonial-rating {
  margin-bottom: var(--space-m);
  display: flex;
  justify-content: flex-start;
  gap: var(--space-xs);

  .star {
    color: var(--color-accent);
    font-size: 1.375rem;
    filter: drop-shadow(0 2px 4px rgba(30, 233, 169, 0.2));
    transition: transform 0.3s ease;

    .testimonial-card:hover & {
      transform: scale(1.15) translateY(-3px);
    }

    &:nth-child(1) {
      animation: popIn 0.5s ease 0.1s backwards;
    }
    &:nth-child(2) {
      animation: popIn 0.5s ease 0.2s backwards;
    }
    &:nth-child(3) {
      animation: popIn 0.5s ease 0.3s backwards;
    }
    &:nth-child(4) {
      animation: popIn 0.5s ease 0.4s backwards;
    }
    &:nth-child(5) {
      animation: popIn 0.5s ease 0.5s backwards;
    }
  }
}

.testimonial-comment {
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
  line-height: 1.8;
  margin-bottom: var(--space-l);
  font-style: italic;
  color: var(--color-dark);
  opacity: 0.9;
  position: relative;
  z-index: 1;
  flex: 1;
}

.testimonial-author {
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--space-xs);
  font-size: 1rem;
  margin-top: auto;
}

.testimonial-date {
  font-size: 0.85rem;
  opacity: 0.6;
  color: var(--color-dark);
}

@keyframes popIn {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 768px) {
  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .testimonial-card {
    padding: var(--space-l);

    &::before {
      font-size: 4rem;
      top: 0;
      left: 5px;
    }
  }

  .testimonials-title {
    margin-bottom: var(--space-xl);
  }

  .testimonial-comment {
    font-size: var(--text-small-size);
  }
}

@media (max-width: 480px) {
  .testimonials-grid {
    gap: var(--space-m);
  }

  .testimonial-card {
    padding: var(--space-m);

    &::before {
      font-size: 3rem;
    }
  }

  .testimonial-comment {
    font-size: 0.95rem;
    margin-bottom: var(--space-m);
  }

  .testimonial-rating {
    margin-bottom: var(--space-s);
  }
}
</style>
