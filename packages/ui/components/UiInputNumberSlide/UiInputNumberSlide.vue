<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch, useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false,
    default: null,
  },

  step: {
    type: [String, Number],
    required: false,
    default: 1,
  },

  /*
  Number of pixels to travel for the to increment by one step
  */
  stepWidth: {
    type: [String, Number],
    required: false,
    default: 8,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerValue = ref()
watch(
  () => props.modelValue,
  (newValue) => {
    const floatValue = parseFloat(newValue)
    innerValue.value = isNaN(floatValue) ? null : floatValue
  },
  { immediate: true },
)

let initialX = null
let initialValue = null
let stepValue = parseFloat(props.step)

function onDragStart(evt) {
  initialX = evt.type == 'touchstart' ? evt.touches[0].clientX : evt.clientX
  initialValue = parseFloat(innerValue.value) || 0

  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('touchmove', onDragMove)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchend', onDragEnd)
}

function onDragMove(evt) {
  evt.preventDefault()
  let pointer = evt.type == 'touchmove' ? evt.touches[0] : evt
  let diff = pointer.clientX - initialX

  innerValue.value = initialValue + Math.floor(diff / props.stepWidth) * stepValue
  emit('update:modelValue', innerValue.value)
}

function onDragEnd() {
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('touchmove', onDragMove)
  window.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('touchend', onDragEnd)
}
</script>

<template>
  <input
    v-model="innerValue"
    v-bind="attrs"
    class="UiInputNumberSlide UiInput__element"
    type="number"
    :step="step"
    style="cursor: col-resize"
    @input="emit('update:modelValue', innerValue)"
    @mousedown="onDragStart($event)"
    @touchstart="onDragStart($event)"
  >
</template>