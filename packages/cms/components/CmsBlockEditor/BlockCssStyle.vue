<script setup>
import { ref, watch, inject } from 'vue'
import { UiInput } from '@/packages/ui'
import { useI18n } from '@/packages/i18n'
import SpacingEditor from './props/SpacingEditor.vue'
import PropBackground from './props/PropBackground.vue'

const props = defineProps({
  /*
  Object defining CSS rules/variables
  {
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


const injectedStoryEditor = inject('$_cms_story_builder', {})
const uploadsEndpoint = injectedStoryEditor.settings?.uploads?.endpoint

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = typeof newValue == 'object' ? { ...newValue } : {}
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}

function toggleProperty(propName, defaultValue = null) {
  innerValue.value[propName] = innerValue.value?.[propName] ? null : defaultValue
  emitUpdate()
}

const i18n = useI18n({
  en: {
    'BlockCssStyle.ContentWidth': 'Max. content width',

    'BlockCssStyle.Background': 'Background',
    'BlockCssStyle.Margin': 'Margin',
    'BlockCssStyle.Padding': 'Padding',
    'BlockCssStyle.Colors': 'Colors',

    'BlockCssStyle.colorBackground': 'Background',
    'BlockCssStyle.colorForeground': 'Font',
    'BlockCssStyle.colorPrimary': 'Contrast',
    'BlockCssStyle.colorDanger': 'Warning',
  },

  es: {
    'BlockCssStyle.ContentWidth': 'Ancho máximo del contenido',

    'BlockCssStyle.Background': 'Fondo',
    'BlockCssStyle.Margin': 'Márgen',
    'BlockCssStyle.Padding': 'Relleno',
    'BlockCssStyle.Colors': 'Colores',

    'BlockCssStyle.colorBackground': 'Fondo',
    'BlockCssStyle.colorForeground': 'Fuente',
    'BlockCssStyle.colorPrimary': 'Contraste',
    'BlockCssStyle.colorDanger': 'Advertencia',
  },
})
</script>

<template>
  <div class="BlockCssStyle">
    <!-- <details>
      <summary>
        <input
          type="checkbox"
          :checked="!!innerValue['--ui-content-width']"
          @change="toggleProperty('--ui-content-width', 'auto')"
        >
        <span v-text="i18n.t('BlockCssStyle.ContentWidth')" />
      </summary>
      <section>
        <UiInput
          v-model="innerValue['--ui-content-width']"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details> -->

    <details>
      <summary v-text="i18n.t('BlockCssStyle.Background')" />
      <section>
        <PropBackground
          v-model="innerValue"
          :endpoint="uploadsEndpoint"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <details>
      <summary v-text="i18n.t('BlockCssStyle.Colors')" />
      <section>
        <UiInput
          v-model="innerValue['--ui-color-foreground']"
          :label="i18n.t('BlockCssStyle.colorForeground')"
          type="color-css"
          @update:model-value="emitUpdate()"
        />
        <UiInput
          v-model="innerValue['--ui-color-background']"
          :label="i18n.t('BlockCssStyle.colorBackground')"
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
      </section>
    </details>

    <details>
      <summary>
        <input
          type="checkbox"
          :checked="!!innerValue.margin"
          @change="toggleProperty('margin', 'auto auto auto auto')"
        >
        <span v-text="i18n.t('BlockCssStyle.Margin')" />
      </summary>
      <section>
        <UiInput
          :model-value="parseInt(innerValue['--ui-content-width'])"
          :label="i18n.t('BlockCssStyle.ContentWidth')"
          placeholder="px"

          type="number-slide"
          min="600"
          max="2048"
          :step="10"
          @update:model-value="innerValue['--ui-content-width'] = $event + 'px'; emitUpdate()"
        />
        <SpacingEditor
          v-model="innerValue.margin"
          empty-value="auto"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <details>
      <summary>
        <input
          type="checkbox"
          :checked="!!innerValue.padding"
          @change="toggleProperty('padding', '0 0 0 0')"
        >
        <span v-text="i18n.t('BlockCssStyle.Padding')" />
      </summary>
      <section>
        <SpacingEditor
          v-model="innerValue.padding"
          empty-value="0"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>
  </div>
</template>