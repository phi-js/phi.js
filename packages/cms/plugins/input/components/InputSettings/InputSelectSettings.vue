<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui/components'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'
import OptionsEditor from '@/packages/ui/components/UiInputEditor/editors/OptionsEditor.vue'

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


const i18n = useI18n({
  en: {
    'InputSelectSettings.Label': 'Label',
    'InputSelectSettings.VariableName': 'Variable',
    'InputSelectSettings.Options': 'Options',
    'InputSelectSettings.Single': 'Single',
    'InputSelectSettings.Multiple': 'Multiple',
    'InputSelectSettings.ValueType': 'Value type',
    'InputSelectSettings.SelectType': 'Component',
  },
  es: {
    'InputSelectSettings.Label': 'Etiqueta',
    'InputSelectSettings.VariableName': 'Variable',
    'InputSelectSettings.Options': 'Opciones',
    'InputSelectSettings.Single': 'Único',
    'InputSelectSettings.Multiple': 'Múltiple',
    'InputSelectSettings.ValueType': 'Tipo de dato',
    'InputSelectSettings.SelectType': 'Componente',
  },
})

const multipleOptions = [
  {
    text: i18n.t('InputSelectSettings.Single'),
    value: false,
  },
  {
    text: i18n.t('InputSelectSettings.Multiple'),
    value: true,
  },
]
</script>

<template>
  <div class="InputSelectSettings">
    <CmsPropInput
      v-model="block.props.label"
      class="InputSelectSettings__item"
      type="text"
      :label="i18n.t('InputSelectSettings.Label')"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block.props.multiple"
      class="InputSelectSettings__item"
      :label="i18n.t('InputSelectSettings.ValueType')"
      type="select-list"
      :options="multipleOptions"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block['v-model']"
      class="InputSelectSettings__item"
      :label="i18n.t('InputSelectSettings.VariableName')"
      type="variable"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block.props.type"
      class="InputSelectSettings__item"
      :label="i18n.t('InputSelectSettings.SelectType')"
      type="select-native"
      :options="[
        {value: 'select-native', text: 'Nativo'},
        {value: 'select-list', text: 'Lista'},
        {value: 'select-buttons', text: 'Botones'},
        {value: 'select', text: 'Selector con busqueda'},
      ]"
      @update:model-value="emitUpdate"
    />

    <UiInput
      :label="i18n.t('InputSelectSettings.Options')"
      class="InputSelectSettings__item"
    >
      <OptionsEditor
        v-model="block.props.options"
        @update:model-value="emitUpdate"
      />
    </UiInput>
  </div>
</template>

<style lang="scss">
.InputSelectSettings {
  &__item {
    margin-bottom: 1rem;
  }
}
</style>