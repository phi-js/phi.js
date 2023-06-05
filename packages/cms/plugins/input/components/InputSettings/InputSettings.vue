<script setup>
import { computed, ref, watch } from 'vue'

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
    'InputSettings.LoadingLabel': 'Label (while submitting)',
    'InputSettings.Placeholder': 'Placeholder',
    'InputSettings.Subtext': 'Subtext',
    'InputSettings.VariableName': 'Variable name',
    'InputSettings.Debounce': 'Input delay',
    'InputSettings.ValueType': 'Value type',

    'InputSettings.InputType': 'Type',
    'InputSettings.type.Date': 'Day',
    'InputSettings.type.DateRange': 'Range',

    'InputSettings.ButtonType': 'Button type',
    'InputSettings.type.Button': 'Button',
    'InputSettings.type.Submit': 'Submit',

    'InputSettings.DateFormat': 'Date format',
    'InputSettings.DateFormat.native': 'Native [YYYY-MM-DD]',
    'InputSettings.DateFormat.timestamp': 'Timestamp',
  },
  es: {
    'InputSettings.Texts': 'Textos',
    'InputSettings.Options': 'Opciones',
    'InputSettings.Validation': 'Validación',
    'InputSettings.Single': 'Único',
    'InputSettings.Multiple': 'Múltiple',
    'InputSettings.Label': 'Etiqueta',
    'InputSettings.LoadingLabel': 'Etiqueta (mientras envía)',
    'InputSettings.Placeholder': 'Placeholder',
    'InputSettings.Subtext': 'Subtexto',
    'InputSettings.VariableName': 'Nombre de variable',
    'InputSettings.Debounce': 'Demorar input',
    'InputSettings.ValueType': 'Tipo de dato',

    'InputSettings.InputType': 'Tipo',
    'InputSettings.type.Date': 'Día',
    'InputSettings.type.DateRange': 'Rango',

    'InputSettings.ButtonType': 'Tipo de botón',
    'InputSettings.type.Button': 'Botón',
    'InputSettings.type.Submit': 'Enviar formulario',

    'InputSettings.DateFormat': 'Formato de fecha',
    'InputSettings.DateFormat.native': 'Nativo [YYYY-MM-DD]',
    'InputSettings.DateFormat.timestamp': 'Timestamp',
  },
})

const availableComponents = [
  { value: 'InputText', type: 'text', text: i18n.t('plugin.component.InputText.title') },
  { value: 'InputTextarea', type: 'textarea', text: i18n.t('plugin.component.InputTextarea.title') },
  { value: 'InputCheckbox', type: 'checkbox', text: i18n.t('plugin.component.InputCheckbox.title') },
  { value: 'InputDate', type: 'date', text: i18n.t('plugin.component.InputDate.title') },
  { value: 'InputNumber', type: 'number', text: i18n.t('plugin.component.InputNumber.title') },
  { value: 'InputPassword', type: 'password', text: i18n.t('plugin.component.InputPassword.title') },
  // { value: 'InputSelect', type: 'select', text: i18n.t('plugin.component.InputSelect.title') },
  // { value: 'InputUpload', type: 'upload', text: i18n.t('plugin.component.InputUpload.title') },
  // { value: 'InputButton', type: 'submit', text: i18n.t('plugin.component.InputButton.title') },
]

const blockComponent = computed({
  get() {
    return block.value.component
  },
  set(newValue) {
    block.value.component = newValue
    const targetComponent = availableComponents.find((t) => t.value == newValue)
    if (targetComponent) {
      block.value.props.type = targetComponent.type
    }
    emitUpdate()
  },
})

const multipleOptions = [
  {
    text: i18n.t('InputSettings.Single'),
    value: false,
  },
  {
    text: i18n.t('InputSettings.Multiple'),
    value: true,
  },
]
</script>

<template>
  <div class="InputSettings">
    <!-- Button type: submit | button -->
    <UiInput
      v-if="block.component == 'InputButton'"
      v-model="block.props.type"
      type="select-list"
      :label="i18n.t('InputSettings.ButtonType')"
      :options="[
        {value: 'submit', text: i18n.t('InputSettings.type.Submit')},
        {value: 'button', text: i18n.t('InputSettings.type.Button')},
      ]"
      @update:model-value="emitUpdate"
    />

    <!-- Label -->
    <CmsPropInput
      v-model:block="block"
      :model-value="block.props.label"
      type="text"
      :label="i18n.t('InputSettings.Label')"
      @update:model-value="onUpdateLabel"
      @update:block="emitUpdate"
    />

    <!-- Loading label -->
    <CmsPropInput
      v-if="block.component == 'InputButton' && block.props.type == 'submit'"
      v-model="block.props.loadingLabel"
      v-model:block="block"
      :placeholder="block.props.label"
      type="text"
      :label="i18n.t('InputSettings.LoadingLabel')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />

    <!-- Subtext -->
    <CmsPropInput
      v-model="block.props.subtext"
      v-model:block="block"
      type="text"
      :label="i18n.t('InputSettings.Subtext')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />

    <!-- Placeholder -->
    <CmsPropInput
      v-model="block.props.placeholder"
      v-model:block="block"
      type="text"
      :label="i18n.t('InputSettings.Placeholder')"
      @update:model-value="emitUpdate"
      @update:block="emitUpdate"
    />

    <!-- Variable name -->
    <UiInput
      v-model="block['v-model']"
      type="variable"
      :label="i18n.t('InputSettings.VariableName')"
      @update:model-value="emitUpdate"
    />

    <!-- Multiple / Single -->
    <UiInput
      v-if="block.component == 'InputUpload'"
      v-model="block.props.multiple"
      type="select-buttons"
      :options="multipleOptions"
      @update:model-value="emitUpdate"
    />

    <!-- Block type picker -->
    <UiInput
      v-if="!['InputSelect', 'InputUpload', 'InputButton'].includes(block.component)"
      v-model="blockComponent"
      type="select-native"
      :options="availableComponents"
      :label="i18n.t('InputSettings.InputType')"
    />

    <!-- Date options-->
    <UiInput
      v-if="['date', 'date-range'].includes(block.props.type)"
      v-model="block.props.type"
      type="select-list"
      :options="[
        {value: 'date', text: i18n.t('InputSettings.type.Date')},
        {value: 'date-range', text: i18n.t('InputSettings.type.DateRange')},
      ]"
      @update:model-value="emitUpdate"
    />

    <!-- Date format picker -->
    <UiInput
      v-if="['date', 'date-range'].includes(block.props.type)"
      v-model="block.props.format"
      type="select-list"
      :label="i18n.t('InputSettings.DateFormat')"
      :options="[
        {value: '', text: i18n.t('InputSettings.DateFormat.native')},
        {value: 'timestamp', text: i18n.t('InputSettings.DateFormat.timestamp')},
      ]"
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