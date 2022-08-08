<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiDetails } from '@/packages/ui'

import { useStorySettings } from '../../functions'
import CssStyleEditor from '@/packages/ui/components/CssStyleEditor/CssStyleEditor.vue'
import CssBackgroundEditor from '@/packages/ui/components/CssStyleEditor/CssBackgroundEditor.vue'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:block'])

const settings = useStorySettings()
const uploadsEndpoint = settings.uploads.assets

const innerStyle = ref({})

watch(
  () => props.block,
  (block) => innerStyle.value = typeof block?.props?.style == 'object'
    ? { ...block.props.style }
    : {},
  { immediate: true },
)

function emitUpdate() {
  emit('update:block', {
    ...props.block,
    props: {
      ...props.block?.props,
      style: { ...innerStyle.value },
    },
  })
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
  <div class="BlockCssStyle">
    <!-- <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Dimensions')"
    >
      <CssStyleEditor
        v-model="innerStyle"
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
    </UiDetails> -->

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.Margin')"
    >
      <CssStyleEditor
        v-model="innerStyle"
        :endpoint="uploadsEndpoint"
        :schema="{
          properties: {
            'margin': {format: {type: 'css-spacing', props: {emptyValue: 'auto'}}},
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
        v-model="innerStyle"
        :endpoint="uploadsEndpoint"
        :schema="{
          properties: {
            'padding': {format: {type: 'css-spacing', props: {emptyValue: '0'}}},
          }
        }"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>

    <UiDetails
      group="BlockCssStyle"
      :text="i18n.t('BlockCssStyle.background')"
    >
      <CssBackgroundEditor
        v-model="innerStyle"
        :endpoint="uploadsEndpoint"
        @update:model-value="emitUpdate()"
      />
    </UiDetails>
  </div>
</template>