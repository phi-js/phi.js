<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'

const props = defineProps({
  // BLOCK object
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

// internal "block" object (clone of props.modelValue)
const block = ref({ props: {} })
watch(
  () => props.modelValue,
  (newValue) => block.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true },
)

const emitUpdate = function () {
  emit('update:modelValue', block.value)
}

// Auto-set v-model variable name
const autoSetModel = props.modelValue?.['v-model'] !== undefined && !props.modelValue['v-model']

function onUpdateLabel(newLabel) {
  const oldLabel = block.value.props.label
  block.value.props.label = newLabel

  if (autoSetModel) {
    if (!block.value['v-model'] || block.value['v-model'] == camelize(oldLabel)) {
      block.value['v-model'] = camelize(newLabel)
    }
  }

  emitUpdate()
}

function camelize(str) {
  if (!str) {
    return str
  }

  if (typeof str?.$i18n === 'object') {
    str = str.$i18n[Object.keys(str.$i18n)[0]]
  }
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/[^a-zA-Z0-9]+/g, '')
}

const i18n = useI18n({
  en: {
    'InputSettings.Texts': 'Texts',
    'InputSettings.Options': 'Options',
    'InputSettings.Validation': 'Validation',
    'InputSettings.Single': 'Single',
    'InputSettings.Multiple': 'Multiple',
    'InputSettings.Label': 'Label',
    'InputSettings.Placeholder': 'Placeholder',
    'InputSettings.Subtext': 'Subtext',
    'InputSettings.VariableName': 'Variable name',
    'InputSettings.Debounce': 'Input delay',
    'InputSettings.ValueType': 'Value type',
  },
  es: {
    'InputSettings.Texts': 'Textos',
    'InputSettings.Options': 'Opciones',
    'InputSettings.Validation': 'Validación',
    'InputSettings.Single': 'Único',
    'InputSettings.Multiple': 'Múltiple',
    'InputSettings.Label': 'Etiqueta',
    'InputSettings.Placeholder': 'Placeholder',
    'InputSettings.Subtext': 'Subtexto',
    'InputSettings.VariableName': 'Nombre de variable',
    'InputSettings.Debounce': 'Demorar input',
    'InputSettings.ValueType': 'Tipo de dato',
  },
})
</script>

<template>
  <div class="InputSettings">
    <CmsPropInput
      v-model:block="block"
      :model-value="block.props.label"
      type="text"
      :label="i18n.t('InputSettings.Label')"
      @update:model-value="onUpdateLabel"
      @update:block="emitUpdate"
    />

    <CmsPropInput
      v-model="block.props.subtext"
      v-model:block="block"
      type="text"
      :label="i18n.t('InputSettings.Subtext')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />

    <CmsPropInput
      v-model="block.props.placeholder"
      v-model:block="block"
      type="text"
      :label="i18n.t('InputSettings.Placeholder')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />

    <UiInput
      v-model="block['v-model']"
      type="text"
      :label="i18n.t('InputSettings.VariableName')"
      @update:model-value="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.InputSettings {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .UiDetails__contents {
    padding-left: 12px !important;
    padding-bottom: 24px !important;

    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}
</style>