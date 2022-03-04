<script setup>
import { useI18n } from '../../../i18n'

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },

  isEmpty: {
    type: Boolean,
    required: false,
    default: false
  },

  textEmpty: {
    type: String,
    required: false,
    default: ''
  },

  textLoading: {
    type: String,
    required: false,
    default: ''
  }
})

const i18n = useI18n({
  en: {
    'UiLoading.empty': 'There is nothing here',
    'UiLoading.loading': 'Loading'
  },
  es: {
    'UiLoading.empty': 'No hay nada aqui',
    'UiLoading.loading': 'Cargando'
  },
  de: {
    'UiLoading.empty': 'Hier ist nichts',
    'UiLoading.loading': 'Wird geladen'
  },
  fr: {
    'UiLoading.empty': 'Il n\'y a rien ici',
    'UiLoading.loading': 'Chargement'
  },
})
</script>

<template>
  <div
    v-if="props.isLoading || props.isEmpty"
    class="UiLoading"
    :class="{
      'UiLoading--loading': props.isLoading,
      'UiLoading--empty': props.isEmpty,
    }"
  >
    <slot v-if="props.isLoading" name="loading">
      <h1 class="UiLoading__text">{{ props.textLoading || i18n.t('UiLoading.loading') }}</h1>
    </slot>
    <slot v-else-if="props.isEmpty" name="empty">
      <h1 class="UiLoading__text">{{ props.textEmpty || i18n.t('UiLoading.empty') }}</h1>
    </slot>
  </div>
</template>