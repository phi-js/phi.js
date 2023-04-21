<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const ctx = document.createElement('canvas').getContext('2d')
function standardize_color(str){
  ctx.fillStyle = str
  return ctx.fillStyle
}

const hexValue = computed({
  get() {
    return standardize_color(props.modelValue)
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})
</script>

<template>
  <span class="UiInputColorCss">
    <input
      v-model="hexValue"
      class="UiInput__element"
      type="color"
    >
  </span>
</template>