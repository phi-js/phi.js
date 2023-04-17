<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import UiDetails from '../UiDetails/UiDetails.vue'
import UiInput from '../UiInput/UiInput.vue'
import Background from './properties/Background.vue'
import Spacing from './properties/Spacing.vue'
import Typography from './properties/Typography.vue'
import CssDisplay from './properties/CssDisplay.vue'

const i18n = useI18n({
  en: {
    'CssEditor.Spacing': 'Spacing',
    'CssEditor.Background': 'Background',
    'CssEditor.Display': 'Display',
    'CssEditor.Typography': 'Typography',
    'CssEditor.Source': 'CSS',
  },
  es: {
    'CssEditor.Spacing': 'Espaciado',
    'CssEditor.Background': 'Fondo',
    'CssEditor.Display': 'Visualización',
    'CssEditor.Typography': 'Tipografía',
    'CssEditor.Source': 'CSS',
  },
})

const props = defineProps({
  /*
  Object with CSS properties:
  * Existing property names in camelCase format
  will be converted to dash-case (valid CSS property name)
  backgroundImage --> background-image

  {
    "font-family": "MyFontWhatever, sans-serif",
    "color": "#fff",
    "textShadow": "1px 1px 1px #000",
    "backgroundImage": "url(....)",  --> will be converted to "background-image"
    "background-attachment": "fixed",
    ... any CSS property name
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const css = ref({})

watch(
  () => props.modelValue,
  () => css.value = sanitizeCssObject(props.modelValue),
  { immediate: true },
)

function sanitizeCssObject(cssObj) {
  const sanitizedObj = {}

  if (!cssObj || typeof cssObj !== 'object') {
    return sanitizedObj
  }
  for (const [prop, value] of Object.entries(cssObj)) {
    const sanitizedProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    sanitizedObj[sanitizedProp] = value
  }
  return sanitizedObj
}
</script>

<template>
  <div class="CssEditor">
    <UiDetails
      :text="i18n.t('CssEditor.Spacing')"
      class="CssEditor__spacing"
    >
      <Spacing
        v-model="css"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <UiDetails
      :text="i18n.t('CssEditor.Background')"
      class="CssEditor__background"
    >
      <Background
        v-model="css"
        :endpoint="$attrs.endpoint"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <UiDetails
      :text="i18n.t('CssEditor.Display')"
      class="CssEditor__display"
    >
      <CssDisplay
        v-model="css"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <UiDetails
      :text="i18n.t('CssEditor.Typography')"
      class="CssEditor__typography"
    >
      <Typography
        v-model="css"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>

    <!-- Special: Source -->
    <UiDetails
      :text="i18n.t('CssEditor.Source')"
      class="CssEditor__source"
    >
      <UiInput
        v-model="css"
        type="json"
        @update:model-value="emit('update:modelValue', $event)"
      />
    </UiDetails>
  </div>
</template>

<style lang="scss">
.CssEditor {
  &__background,
  &__display,
  &__typography {

    .UiInput {
      width: 100%;
      margin: 3px 0;
      padding: 3px 0;
      border-bottom: 1px solid var(--ui-color-hover);

      display: flex;
      flex-wrap: wrap;

      &__label {
        width: 90px;
        overflow: hidden;
        text-overflow: ellipsis;

        padding: 8px 0;
        font-size: 11px;
        font-weight: normal;
      }

      &__body {
        flex: 1;
      }

      &__element {
        width: 100%;
      }
    }

    .UiSelectButtons {
      flex-wrap: wrap;
    }

    .UiSelectButtons__button {
      // flex: 1;
      width: 130px;
    }
  }
}
</style>