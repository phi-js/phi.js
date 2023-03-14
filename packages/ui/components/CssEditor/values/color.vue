<script setup>
import { UiInput } from '@/packages/ui'

defineProps({
  /*
  String. A css COLOR value
  e.g:.  "#fff", "white", "rgba(....)"
  */
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <UiInput
    :model-value="modelValue"
    class="CssColor"
    type="color"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>