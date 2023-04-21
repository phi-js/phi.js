<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  String. A "flex-wrap" CSS value
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
    class="CssTypeFlexWrap"
    :options="[
      { value: 'wrap', text: 'wrap' },
      { value: 'nowrap', text: 'nowrap' },
    ]"
    @update:model-value="emitUpdate"
  />
</template>