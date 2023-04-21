<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  String. A align-items value
  e.g:. "flex-start", "center", "flex-end"
  */
  modelValue: {
    type: String,
    required: false,
    default: 'flex-start',
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
    class="CssTypeAlignItems"
    :options="[
      { value: 'flex-start', icon: 'mdi:align-vertical-top', text: 'flex-start' },
      { value: 'center', icon: 'mdi:align-vertical-center', text: 'center' },
      { value: 'flex-end', icon: 'mdi:align-vertical-bottom', text: 'flex-end' },
    ]"
    @update:model-value="emitUpdate"
  />
</template>