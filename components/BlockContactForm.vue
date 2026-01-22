<template>
  <div class="block-contact-form">
    <form @submit.prevent="handleSubmit" class="contact-form">
      <div v-if="block.content.showname === 'true'" class="form-field">
        <label for="name">Nom *</label>
        <input
          type="text"
          id="name"
          v-model="formData.name"
          required
          placeholder="Votre nom"
        />
      </div>

      <div v-if="block.content.showemail === 'true'" class="form-field">
        <label for="email">Email *</label>
        <input
          type="email"
          id="email"
          v-model="formData.email"
          required
          placeholder="votre@email.com"
        />
      </div>

      <div v-if="block.content.showphone === 'true'" class="form-field">
        <label for="phone">Téléphone</label>
        <input
          type="tel"
          id="phone"
          v-model="formData.phone"
          placeholder="+41 XX XXX XX XX"
        />
      </div>

      <div v-if="block.content.showsubject === 'true'" class="form-field">
        <label for="subject">Sujet</label>
        <input
          type="text"
          id="subject"
          v-model="formData.subject"
          placeholder="Sujet de votre message"
        />
      </div>

      <div v-if="block.content.showmessage === 'true'" class="form-field form-field-full">
        <label for="message">Message *</label>
        <textarea
          id="message"
          v-model="formData.message"
          required
          rows="6"
          placeholder="Votre message..."
        ></textarea>
      </div>

      <div v-if="block.content.requireconsent === 'true'" class="form-field checkbox-field form-field-full">
        <input
          type="checkbox"
          id="consent"
          v-model="formData.consent"
          required
        />
        <label for="consent">
          J'accepte que mes données soient utilisées pour me recontacter
        </label>
      </div>

      <button
        type="submit"
        class="submit-button"
        :class="`style-${block.content.buttonstyle || 'primary'}`"
        :style="getButtonStyle()"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Envoi en cours...' : (block.content.buttonlabel || 'Envoyer') }}
      </button>

      <div v-if="submitSuccess" class="success-message">
        {{ block.content.successmessage || 'Merci ! Votre message a été envoyé.' }}
      </div>

      <div v-if="submitError" class="error-message">
        Une erreur s'est produite. Veuillez réessayer.
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const props = defineProps<{
  block: CMS_Block_ContactForm
}>()

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

const getColorVar = (color?: string) => {
  if (color === 'primary' || color === 'secondary' || color === 'accent' || color === 'neutral' || color === 'dark') {
    return `var(--color-${color})`
  }
  return ''
}

const getButtonStyle = () => {
  const style: Record<string, string> = {}
  const color = getColorVar(props.block.content.buttoncolor)
  if (!color) return style

  style['--form-button-color'] = color
  style['--form-button-border-color'] = color
  style['--form-button-hover-text-color'] = color

  if (props.block.content.buttoncolor === 'neutral') {
    style['--form-button-text-color'] = 'var(--color-dark)'
    style['--form-button-border-color'] = 'var(--color-dark)'
    style['--form-button-hover-text-color'] = 'var(--color-dark)'
    style['--form-button-hover-bg'] = 'var(--color-neutral)'
  } else {
    style['--form-button-text-color'] = 'var(--color-neutral)'
  }

  return style
}

const handleSubmit = async () => {
  isSubmitting.value = true
  submitSuccess.value = false
  submitError.value = false

  try {
    // TODO: Implement form submission to backend
    // Pour l'instant, simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000))

    submitSuccess.value = true

    // Reset form
    Object.keys(formData).forEach(key => {
      if (typeof formData[key as keyof typeof formData] === 'boolean') {
        formData[key as keyof typeof formData] = false as never
      } else {
        formData[key as keyof typeof formData] = '' as never
      }
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    submitError.value = true
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss">
.block-contact-form {
  margin: 0;
  padding: 0;
  background: var(--color-neutral);
  border: none;
  border-radius: var(--radius-m);
  color: var(--color-primary);
}

.form-title {
  text-align: left;
  margin-bottom: var(--space-m);
  font-size: clamp(1.5rem, 3.5vw, 2rem);
  font-weight: 800;
  color: var(--color-primary);
}

.form-subtitle {
  text-align: left;
  margin-bottom: var(--space-xxl);
  opacity: 0.9;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-primary);
}

.contact-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-l);
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-s);

  label {
    font-weight: 700;
    color: var(--color-primary);
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  input,
  textarea {
    padding: var(--space-m);
    border: 1px solid var(--color-primary);
    border-radius: var(--radius-m);
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    background-color: transparent;
    color: var(--color-primary);

    &::placeholder {
      color: rgba(24, 0, 158, 0.5);
      font-weight: 400;
    }

    &:hover:not(:focus) {
      border-color: rgba(24, 0, 158, 0.8);
      box-shadow: 0 2px 8px rgba(24, 0, 158, 0.12);
    }

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 4px 12px rgba(24, 0, 158, 0.18);
      background-color: transparent;
    }
  }

  textarea {
    resize: vertical;
    min-height: 150px;
  }

  &.checkbox-field {
    flex-direction: row;
    align-items: center;
    gap: var(--space-m);
    margin-top: var(--space-s);

    input[type="checkbox"] {
      width: 22px;
      height: 22px;
      cursor: pointer;
      accent-color: var(--color-primary);
      flex-shrink: 0;
    }

    label {
      cursor: pointer;
      font-weight: 500;
      font-size: 0.95rem;
      text-transform: none;
      letter-spacing: normal;
      margin: 0;
    }
  }
}

.form-field-full {
  grid-column: 1 / -1;
}

.submit-button {
  grid-column: 1 / -1;
  padding: var(--space-m) var(--space-xl);
  border: 2px solid var(--form-button-border-color, var(--form-button-color, var(--color-accent)));
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: var(--space-m);
  background-color: var(--form-button-color, var(--color-accent));
  color: var(--form-button-text-color, var(--color-neutral));

  &:hover:not(:disabled) {
    background-color: var(--form-button-hover-bg, transparent);
    color: var(--form-button-hover-text-color, var(--form-button-color, var(--color-accent)));
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.success-message {
  grid-column: 1 / -1;
  padding: var(--space-m);
  background-color: rgba(30, 233, 169, 0.1);
  border: 2px solid rgba(30, 233, 169, 0.4);
  border-radius: var(--radius-m);
  color: rgb(0, 180, 120);
  text-align: center;
  font-weight: 600;
  animation: slideDown 0.3s ease;
}

.error-message {
  grid-column: 1 / -1;
  padding: var(--space-m);
  background-color: rgba(200, 0, 0, 0.1);
  border: 2px solid rgba(200, 0, 0, 0.4);
  border-radius: var(--radius-m);
  color: rgb(180, 0, 0);
  text-align: center;
  font-weight: 600;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .contact-form {
    grid-template-columns: 1fr;
  }
}
</style>
