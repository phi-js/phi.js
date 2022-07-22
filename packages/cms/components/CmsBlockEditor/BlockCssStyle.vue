<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiDetails } from '@/packages/ui'

import { useStorySettings } from '../../functions'
import CssStyleEditor from '@/packages/ui/components/CssStyleEditor/CssStyleEditor.vue'
import CssBackgroundEditor from '@/packages/ui/components/CssStyleEditor/CssBackgroundEditor.vue'

// import SpacingEditor from './props/SpacingEditor.vue'
// import PropBackground from './props/PropBackground.vue'

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
    'BlockCssStyle.background': 'Background',
    'BlockCssStyle.Dimensions': 'Dimensions',
    'BlockCssStyle.Margin': 'Margin',
    'BlockCssStyle.Padding': 'Padding',

    'BlockCssStyle.width': 'Width',
    'BlockCssStyle.height': 'Height',
    'BlockCssStyle.minWidth': 'Min. width',
    'BlockCssStyle.minHeight': 'Min. height',
  },

  es: {
    'BlockCssStyle.background': 'Fondo',
    'BlockCssStyle.Dimensions': 'Dimensiones',
    'BlockCssStyle.Margin': 'Márgen',
    'BlockCssStyle.Padding': 'Relleno',

    'BlockCssStyle.width': 'Ancho',
    'BlockCssStyle.height': 'Alto',
    'BlockCssStyle.minWidth': 'Ancho min.',
    'BlockCssStyle.minHeight': 'Alto min.',
  },
})
</script>

<template>
  <div class="BlockCssStyle UiForm--wide">
    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.background')"
    >
      <CssBackgroundEditor
        v-model="innerValue"
        :endpoint="uploadsEndpoint"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Dimensions')"
    >
      <CssStyleEditor
        v-model="innerValue"
        :endpoint="uploadsEndpoint"
        :schema="{
          properties: {
            'width': {title: i18n.t('BlockCssStyle.width'), format: 'css-unit'},
            'height': {title: i18n.t('BlockCssStyle.height'), format: 'css-unit'},
            'min-width': {title: i18n.t('BlockCssStyle.minWidth'), format: 'css-unit'},
            'min-height': {title: i18n.t('BlockCssStyle.minHeight'), format: 'css-unit'},
          }
        }"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Margin')"
    >
      <CssStyleEditor
        v-model="innerValue"
        :endpoint="uploadsEndpoint"
        :schema="{
          properties: {
            'margin': {format: 'css-spacing'},
          }
        }"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Padding')"
    >
      <CssStyleEditor
        v-model="innerValue"
        :endpoint="uploadsEndpoint"
        :schema="{
          properties: {
            'padding': {format: 'css-spacing'},
          }
        }"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>
  </div>
</template>