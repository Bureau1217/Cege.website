<template>
  <StyleBlock variant="primary" v-if="footerData" class="footer-style-block">
      <div class="footer-content">
        <!-- Colonne gauche: Texte -->
        <div class="footer-left">
          <div v-if="footerData.titre" class="footer-title" v-html="footerData.titre" />
        </div>

        <!-- Colonne droite: Infos de contact -->
        <div class="footer-right">
          <div class="footer-contact-grid">
            <div class="footer-block" v-if="footerData.adresse">
              <h4>
                <span
                  v-if="footerIcons.adresse?.url"
                  class="footer-icon"
                  :style="getIconStyle(footerIcons.adresse.url)"
                  aria-hidden="true"
                />
                Adresse
              </h4>
              <div class="footer-text" v-html="footerData.adresse" />
            </div>

            <div class="footer-block" v-if="footerData.telephone">
              <h4>
                <span
                  v-if="footerIcons.telephone?.url"
                  class="footer-icon"
                  :style="getIconStyle(footerIcons.telephone.url)"
                  aria-hidden="true"
                />
                Téléphone
              </h4>
              <div class="footer-text">
                <a :href="`tel:${footerData.telephone}`">{{ footerData.telephone }}</a>
              </div>
            </div>

            <div class="footer-block" v-if="footerData.email">
              <h4>
                <span
                  v-if="footerIcons.email?.url"
                  class="footer-icon"
                  :style="getIconStyle(footerIcons.email.url)"
                  aria-hidden="true"
                />
                Email
              </h4>
              <div class="footer-text">
                <a :href="`mailto:${footerData.email}`">{{ footerData.email }}</a>
              </div>
            </div>

            <div class="footer-block" v-if="footerData.horaires">
              <h4>
                <span
                  v-if="footerIcons.horaires?.url"
                  class="footer-icon"
                  :style="getIconStyle(footerIcons.horaires.url)"
                  aria-hidden="true"
                />
                Horaires
              </h4>
              <div class="footer-text" v-html="footerData.horaires" />
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <nav class="footer-menu" aria-label="Footer">
          <ul class="footer-menu-list">
            <li v-for="item in footerNavItems" :key="item.to">
              <NuxtLink :to="item.to" class="footer-menu-link">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <p>&copy; {{ new Date().getFullYear() }} CEGE. Tous droits réservés.</p>
      </div>
  </StyleBlock>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import StyleBlock from './StyleBlock.vue'
import { useCmsImage } from '@/composables/useCmsImage'

const { data } = await useFetch<any>('/api/CMS_KQLRequest', {
  method: 'POST',
  body: {
    query: 'site',
    select: {
      footer: {
        query: "site.find('footer')",
        select: {
          titre: 'page.titre.toBlocks.toHtml',
          adresse: 'page.adresse.value',
          telephone: 'page.telephone.value',
          email: 'page.email.value',
          horaires: 'page.horaires.value',
          icone_adresse: 'page.icone_adresse.value',
          icone_telephone: 'page.icone_telephone.value',
          icone_email: 'page.icone_email.value',
          icone_horaires: 'page.icone_horaires.value',
          files: {
            query: 'page.files',
            select: {
              uuid: 'file.uuid',
              url: 'file.url',
              alt: 'file.alt.value'
            }
          }
        }
      }
    }
  }
})

const footerFiles = computed(() => footerData.value?.files || [])
const { getCmsImageUrl } = useCmsImage(footerFiles)

const footerNavItems = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Nos Services' },
  { to: '/contact', label: 'Nous Contacter' },
  { to: '/mentions-legales', label: 'Mentions légales' }
]

const footerData = computed(() => {
  if (data.value && data.value.status === 'ok') {
    return data.value.result.footer
  }
  return null
})

const footerFilesByUuid = computed(() => {
  const files = footerData.value?.files || []
  const map: Record<string, any> = {}
  files.forEach((file: any) => {
    if (file?.uuid) {
      map[file.uuid] = file
      map[`file://${file.uuid}`] = file
    }
  })
  return map
})

const extractFileRef = (value: string) => {
  const match = value.match(/file:\/\/[a-z0-9]+/i)
  if (match) return match[0]
  return value.trim()
}

const resolveIcon = (fieldValue: any) => {
  if (!fieldValue) return null
  if (Array.isArray(fieldValue)) {
    return resolveIcon(fieldValue[0])
  }
  if (typeof fieldValue === 'object') {
    if (fieldValue.url) {
      return { url: fieldValue.url, alt: fieldValue.alt || '' }
    }
    if (fieldValue.uuid) {
      fieldValue = `file://${fieldValue.uuid}`
    }
  }
  if (typeof fieldValue !== 'string') return null

  const normalized = extractFileRef(fieldValue)
  const file = footerFilesByUuid.value[normalized] || footerFilesByUuid.value[normalized.replace('file://', '')]
  if (file) {
    return { url: file.url, alt: file.alt || '' }
  }

  return { url: normalized, alt: '' }
}

const footerIcons = computed(() => {
  const current = footerData.value
  return {
    adresse: resolveIcon(current?.icone_adresse),
    telephone: resolveIcon(current?.icone_telephone),
    email: resolveIcon(current?.icone_email),
    horaires: resolveIcon(current?.icone_horaires)
  }
})

const getIconStyle = (url: string) => {
  const resolved = getCmsImageUrl(url)
  return {
    maskImage: `url(${resolved})`,
    WebkitMaskImage: `url(${resolved})`
  }
}

</script>

<style scoped lang="scss">
.footer-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xxxl);
  margin-bottom: var(--space-xxl);
  max-width: var(--container-width);
  margin: 0 auto var(--space-xxl) auto;
}

.footer-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.footer-title {
  margin: 0;
  color: white;
}

.footer-title :deep(h1),
.footer-title :deep(h2),
.footer-title :deep(h3),
.footer-title :deep(h4) {
  margin: 0;
  line-height: 1.2;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.footer-title :deep(h1) {
  font-size: clamp(2rem, 4vw, 3rem);
}

.footer-title :deep(h2) {
  font-size: clamp(1.5rem, 3vw, 2.5rem);
}

.footer-title :deep(h3) {
  font-size: clamp(1.25rem, 2.5vw, 2rem);
}

.footer-title :deep(h4) {
  font-size: 1.1rem;
}

.footer-title :deep(p) {
  margin: 0;
  font-size: var(--text-base-size);
  font-weight: var(--text-base-weight);
  line-height: 1.6;
}

.footer-menu {
  margin-top: var(--space-m);
}

.footer-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-m);
}

.footer-menu-link {
  color: white;
  text-decoration: none;
  font-size: var(--text-small-size);
  font-weight: var(--text-small-weight);
  opacity: 0.9;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
}

.footer-right {
  display: flex;
  align-items: flex-start;
}

.footer-contact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-xl);
  width: 100%;
  --footer-contact-text-color: var(--color-neutral);
  --footer-contact-text-color-hover: var(--color-primary);
  --footer-contact-icon-color: var(--color-accent);
  --footer-contact-icon-color-hover: var(--color-accent);
}

.footer-block {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 180px;
  padding: var(--space-m);
  border-radius: var(--radius-m);
  border: 2px solid var(--color-accent);
  background: transparent;
  color: var(--footer-contact-text-color);
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  h4 {
    display: flex;
    align-items: center;
    gap: var(--space-s);
    font-size: 1rem;
    font-weight: 700;
    color: inherit;
    margin-bottom: var(--space-m);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    opacity: 0.95;
  }

  &:hover {
    background: var(--color-neutral);
    border-color: var(--color-accent);
    color: var(--footer-contact-text-color-hover);
  }

  &:hover .footer-icon {
    background-color: var(--footer-contact-icon-color-hover);
  }
}

.footer-icon {
  width: 20px;
  height: 20px;
  display: inline-block;
  background-color: var(--footer-contact-icon-color);
  mask-mode: alpha;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-mode: alpha;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  border-radius: 0;
  box-shadow: none;
}

.footer-text {
  font-size: var(--text-base-size);
  font-weight: 600;
  line-height: 1.6;
  color: inherit;
  opacity: 0.8;
  overflow-wrap: anywhere;
  word-break: break-word;

  :deep(p) {
    margin: 0 0 var(--space-s) 0;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(strong) {
    font-weight: 700;
    color: inherit;
    opacity: 1;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: opacity 0.2s ease;
    overflow-wrap: anywhere;
    word-break: break-word;

    &:hover {
      opacity: 0.7;
      text-decoration: underline;
    }
  }
}

.footer-bottom {
  text-align: center;
  padding-top: var(--space-xl);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  max-width: var(--container-width);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-s);

  p {
    font-size: 0.875rem;
    color: white;
    opacity: 0.7;
    margin: 0;
  }
}

@media (max-width: 968px) {
  .footer-contact-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-m);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }

  .footer-block {
    min-height: 120px;
  }

  .footer-contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
