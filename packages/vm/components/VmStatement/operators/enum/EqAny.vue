<script setup>
import { UiInput } from '../../../../../ui'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  fieldSchema: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
function emitUpdate(newValue) {
  emit('update:modelValue', newValue)
}

</script>
<template>
  <UiInput
    type="select-list"
    multiple
    :model-value="props.modelValue"
    :options="props.fieldSchema?.enum || []"
    @update:modelValue="emitUpdate"
  />
</template>