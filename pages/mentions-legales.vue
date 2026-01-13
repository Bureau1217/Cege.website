<template>
  <main class="v-mentions">
    <template v-if="data?.status === 'ok' && mentions">
      <StyleBlock variant="white">
        <div class="mentions-grid">
          <div class="mentions-left">
            <h1 class="mentions-title">
              {{ mentions.title || 'Mentions legales' }}
            </h1>
          </div>
          <div class="mentions-right">
            <div
              v-if="mentions.texte"
              class="mentions-text"
              v-html="mentions.texte"
            />
          </div>
        </div>
      </StyleBlock>
    </template>

    <template v-else>
      <div class="error-state">
        <h1>Erreur de chargement</h1>
        <p>Impossible de charger le contenu depuis le CMS.</p>
        <p v-if="data?.message">{{ data.message }}</p>
        <p v-if="pending">Chargement en cours...</p>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import StyleBlock from '@/components/StyleBlock.vue'

type FetchData = CMS_API_Response & {
  result: {
    mentions: CMS_API_MentionsLegalesPage
  }
}

const { data, pending } = await useFetch<FetchData>('/api/CMS_KQLRequest', {
  lazy: true,
  method: 'POST',
  body: {
    query: 'site',
    select: {
          mentions: {
        query: "site.find('mentions-legales')",
        select: {
          title: true,
          slug: true,
          texte: 'page.texte.toBlocks.toHtml'
        }
      }
    }
  }
})

const mentions = computed(() => data.value?.result?.mentions ?? null)

useHead({
  title: 'Mentions legales - CEGE'
})
</script>

<style scoped lang="scss">
.mentions-grid {
  max-width: var(--container-width);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-xxxl);
  align-items: start;
  width: 100%;
}

.mentions-left {
  position: sticky;
  top: 120px;
  align-self: start;
}

.mentions-right {
  min-width: 0;
}

.mentions-title {
  margin: 0;
  color: var(--color-primary);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
}

.mentions-text {
  color: var(--color-dark);
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
  line-height: 1.8;

  :deep(p) {
    margin: 0 0 var(--space-m) 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(h2),
  :deep(h3),
  :deep(h4) {
    margin: 0 0 var(--space-s) 0;
    color: var(--color-primary);
    font-weight: 700;
    line-height: 1.3;
  }

  :deep(.color-primary) {
    color: var(--color-primary);
  }

  :deep(.color-secondary) {
    color: var(--color-secondary);
  }

  :deep(.color-accent) {
    color: var(--color-accent);
  }

  :deep(.color-neutral) {
    color: var(--color-neutral);
  }

  :deep(.color-dark) {
    color: var(--color-dark);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--space-m) 1.25rem;
    padding: 0;
  }

  :deep(li) {
    margin-bottom: var(--space-xs);
  }

  :deep(a) {
    color: var(--color-primary);
    text-decoration: underline;
  }
}

@media (max-width: 900px) {
  .mentions-grid {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .mentions-left {
    position: static;
  }
}

.error-state {
  text-align: center;
  padding: var(--space-xxxl);

  h1 {
    color: var(--color-primary);
    margin-bottom: var(--space-l);
  }

  p {
    color: var(--color-dark);
    opacity: 0.7;
  }
}
</style>
