<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui/components'
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
    'InputSelectSettings.Single': 'Single',
    'InputSelectSettings.Multiple': 'Multiple',
    'InputSelectSettings.ValueType': 'Value type',
  },
  es: {
    'InputSelectSettings.Single': 'Único',
    'InputSelectSettings.Multiple': 'Múltiple',
    'InputSelectSettings.ValueType': 'Tipo de dato',
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
    <UiInput
      v-model="block.props.multiple"
      :label="i18n.t('InputSelectSettings.ValueType')"
      type="select-buttons"
      :options="multipleOptions"
      @update:model-value="emitUpdate"
    />

    <OptionsEditor
      v-model="block.props.options"
      @update:model-value="emitUpdate"
    />
  </div>
</template>