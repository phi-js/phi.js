<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  String. A background-attachment value
  e.g:. "scroll", "fixed", "local"
  */
  modelValue: {
    type: String,
    required: false,
    default: 'scroll',
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
    type="select-native"
    class="CssJustifyContent"
    :options="[
      { value: null, text: 'default' },
      { value: 'center', icon: 'mdi:align-horizontal-center', text: 'center' },
      { value: 'flex-start', icon: 'mdi:align-horizontal-left', text: 'flex-start' },
      { value: 'flex-end', icon: 'mdi:align-horizontal-right', text: 'flex-end' },
      { value: 'space-between', icon: 'mdi:format-indent-increase', text: 'space-between' },
      { value: 'space-around', icon: 'mdi:format-indent-decrease', text: 'space-around' },
      { value: 'space-evenly', icon: 'mdi:format-horizontal-align-center', text: 'space-evenly' },
    ]"
    @update:model-value="emitUpdate"
  />
</template>