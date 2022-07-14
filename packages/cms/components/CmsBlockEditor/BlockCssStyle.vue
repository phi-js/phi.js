<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput, UiDetails } from '@/packages/ui'

import SpacingEditor from './props/SpacingEditor.vue'
import PropBackground from './props/PropBackground.vue'
import { useStorySettings } from '../../functions'

const props = defineProps({
  /*
  Object defining CSS rules/variables
  {
    "color": "#000000",
    "background-color": "#000000",
    "--ui-content-width": "70%",
    ...
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const settings = useStorySettings()
const uploadsEndpoint = settings.uploads.assets

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => innerValue.value = typeof newValue == 'object' ? { ...newValue } : {},
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}

const i18n = useI18n({
  en: {
    'BlockCssStyle.ContentWidth': 'Max. content width',
    'BlockCssStyle.Background': 'Background',
    'BlockCssStyle.Margin': 'Margin',
    'BlockCssStyle.Padding': 'Padding',
    'BlockCssStyle.Font': 'Font',
    'BlockCssStyle.colorBackground': 'Background',
    'BlockCssStyle.colorForeground': 'Color',
    'BlockCssStyle.colorPrimary': 'Contrast',
    'BlockCssStyle.colorDanger': 'Warning',
  },

  es: {
    'BlockCssStyle.ContentWidth': 'Ancho máximo del contenido',
    'BlockCssStyle.Background': 'Fondo',
    'BlockCssStyle.Margin': 'Márgen',
    'BlockCssStyle.Padding': 'Relleno',
    'BlockCssStyle.Font': 'Fuente',
    'BlockCssStyle.colorBackground': 'Fondo',
    'BlockCssStyle.colorForeground': 'Color',
    'BlockCssStyle.colorPrimary': 'Contraste',
    'BlockCssStyle.colorDanger': 'Advertencia',
  },
})
</script>

<template>
  <div class="BlockCssStyle">
    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Background')"
    >
      <PropBackground
        v-model="innerValue"
        :endpoint="uploadsEndpoint"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Font')"
    >
      <UiInput
        v-model="innerValue['color']"
        :label="i18n.t('BlockCssStyle.colorForeground')"
        type="color-css"
        @update:model-value="emitUpdate()"
      />
      <UiInput
        v-model="innerValue['--ui-color-primary']"
        :label="i18n.t('BlockCssStyle.colorPrimary')"
        type="color-css"
        @update:model-value="emitUpdate()"
      />
      <UiInput
        v-model="innerValue['--ui-color-danger']"
        :label="i18n.t('BlockCssStyle.colorDanger')"
        type="color-css"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Padding')"
    >
      <SpacingEditor
        v-model="innerValue.padding"
        empty-value="0"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Margin')"
    >
      <SpacingEditor
        v-model="innerValue.margin"
        empty-value="auto"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>
  </div>
</template>