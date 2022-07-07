<script setup>
import { ref, watch, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput, UiDetails } from '@/packages/ui/components'
import OptionsEditor from '@/packages/ui/components/UiInputEditor/editors/OptionsEditor.vue'

import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'
import { getPluginData } from '../../../../functions'
const pluginData = getPluginData()

const props = defineProps({
  modelValue: {
    type: Object, // block object
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const block = ref({ props: {} })
const autoSetModel = ref(!props.modelValue?.['v-model'])

watch(
  () => props.modelValue,
  (newValue) => block.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true },
)

const isSelect = computed(() => block.value?.props?.type && block.value.props.type.substring(0, 6) == 'select')

const emitUpdate = function () {
  emit('update:modelValue', block.value)
}

function onUpdateModel() {
  autoSetModel.value = !block.value['v-model'].trim()
  emitUpdate()
}

function onUpdateLabel() {
  if (autoSetModel.value) {
    block.value['v-model'] = camelize(block.value.props.label)
  }
  emitUpdate()
}

function camelize(str) {
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
    'InputSettings.Data': 'Data',
    'InputSettings.Single': 'Single',
    'InputSettings.Multiple': 'Multiple',
    'InputSettings.Label': 'Label',
    'InputSettings.Placeholder': 'Placeholder',
    'InputSettings.Subtext': 'Subtext',
    'InputSettings.VariableName': 'Variable name',
    'InputSettings.Debounce': 'Input delay',
    'InputSettings.ValueType': 'Value type',
    'InputSettings.Advanced': 'Advanced options',
  },
  es: {
    'InputSettings.Texts': 'Textos',
    'InputSettings.Options': 'Opciones',
    'InputSettings.Data': 'Datos',
    'InputSettings.Single': 'Único',
    'InputSettings.Multiple': 'Múltiple',
    'InputSettings.Label': 'Etiqueta',
    'InputSettings.Placeholder': 'Placeholder',
    'InputSettings.Subtext': 'Subtexto',
    'InputSettings.VariableName': 'Nombre de variable',
    'InputSettings.Debounce': 'Demorar input',
    'InputSettings.ValueType': 'Tipo de dato',
    'InputSettings.Advanced': 'Opciones avanzadas',
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
  <div class="InputSettings UiForm--wide">
    <UiDetails
      open
      group="InputSettings"
      :text="i18n.t('InputSettings.Data')"
    >
      <CmsPropInput
        v-model="block.props.label"
        v-model:block="block"
        type="text"
        :label="i18n.t('InputSettings.Label')"
        @update:model-value="onUpdateLabel"
        @update:block="emitUpdate"
      />

      <UiInput
        v-model="block['v-model']"
        :label="i18n.t('InputSettings.VariableName')"
        type="text"
        @update:model-value="onUpdateModel"
      />
    </UiDetails>

    <UiDetails
      v-if="isSelect"
      group="InputSettings"
      :text="i18n.t('InputSettings.Options')"
      open
    >
      <OptionsEditor
        v-model="block.props.options"
        @update:model-value="emitUpdate"
      />

      <UiInput
        v-model="block.props.multiple"
        :label="i18n.t('InputSettings.ValueType')"
        type="select-buttons"
        :options="multipleOptions"
        @update:model-value="emitUpdate"
      />
    </UiDetails>

    <UiDetails
      group="InputSettings"
      :text="i18n.t('InputSettings.Texts')"
    >
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
    </UiDetails>

    <UiDetails
      group="InputSettings"
      :text="i18n.t('InputSettings.Advanced')"
    >
      <UiInput
        v-model="block.props.debounce"
        :label="i18n.t('InputSettings.Debounce')"
        type="number"
        placeholder="ms."
        @update:model-value="emitUpdate"
      />

      <Component
        :is="pluginData.getSlotComponent('InputSettings')"
        v-model="block"
        @update:model-value="emitUpdate"
      />
    </UiDetails>
  </div>
</template>

<style lang="scss">
.InputSettings {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  .UiDetails__contents {
    padding-left: 12px;
    padding-bottom: 24px;

    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}
</style>