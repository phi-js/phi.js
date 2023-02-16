<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui/components'
import { getPluginData } from '../../functions'

const pluginData = getPluginData()

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])


// Handle internal "block" value (clone of props.modelValue)
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
    'BlockDataEditor.VariableName': 'Variable name',
    'BlockDataEditor.Debounce': 'Input delay',
  },
  es: {
    'BlockDataEditor.VariableName': 'Nombre de variable',
    'BlockDataEditor.Debounce': 'Demorar input',
  },
})
</script>

<template>
  <div class="BlockDataEditor UiForm UiForm--wide">
    <UiInput
      v-model="block['v-model']"
      :label="i18n.t('BlockDataEditor.VariableName')"
      type="text"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="block.props.debounce"
      :label="i18n.t('BlockDataEditor.Debounce')"
      type="number"
      placeholder="ms."
      @update:model-value="emitUpdate"
    />

    <Component
      :is="pluginData.getSlotComponent('BlockDataEditor')"
      v-model="block"
      @update:model-value="emitUpdate"
    />
  </div>
</template>