<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  String. A "display" CSS value
  e.g:. "block", "flex", "inline-block" ...
  */
  modelValue: {
    type: String,
    required: false,
    default: 'block',
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref('')
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = newValue,
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', innerValue.value)
}
</script>

<template>
  <UiInput
    v-model="innerValue"
    type="select-buttons"
    class="CssTypeDisplay"
    :options="[
      { value: 'block', text: 'block' },
      { value: 'inline', text: 'inline' },
      { value: 'flex', text: 'flex' },
      { value: 'inline-block', text: 'inline-block' },
      { value: 'inline-flex', text: 'inline-flex' },
      { value: 'none', text: 'none' },
    ]"
    @update:model-value="emitUpdate"
  />
</template>