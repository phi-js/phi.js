<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch, useAttrs } from 'vue'

const attrs = useAttrs()

const props = defineProps({
  /* Timer in milliseconds (e.g. 100749) */
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
})
const emit = defineEmits(['update:modelValue'])

const inner = ref({
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0,
})

watch(
  () => props.modelValue,
  (newValue) => {
    const intValue = parseInt(newValue) || 0

    inner.value.hour = Math.floor(intValue / 3.6e+6)
    inner.value.minute = Math.floor(intValue / 60000) % 60
    inner.value.second = Math.floor(intValue / 1000) % 60
    inner.value.millisecond = intValue % 1000
  },
  { immediate: true },
)

function emitUpdate() {
  let intValue = parseInt(inner.value.hour) * 3.6e+6
    + parseInt(inner.value.minute) * 60000
    + parseInt(inner.value.second) * 1000
    + parseInt(inner.value.millisecond)

  emit('update:modelValue', intValue)
}
</script>

<template>
  <div class="UiInputTimer">
    <input
      v-model="inner.minute"
      class="UiInputTimer__minute UiInput__element"
      type="number"
      size="2"
      title="Minute"
      @input="emitUpdate()"
    >:<input
      v-model="inner.second"
      class="UiInputTimer__second UiInput__element"
      type="number"
      size="2"
      title="Second"
      @input="emitUpdate()"
    >:<input
      v-model="inner.millisecond"
      class="UiInputTimer__millisecond UiInput__element"
      type="number"
      size="3"
      title="Millisecond"
      @input="emitUpdate()"
    >
  </div>
</template>

<style lang="scss">
.UiInputTimer {
  display: flex;
  align-items: center;
  gap: 2px;

  &__minute,
  &__second,
  &__millisecond {
    width: 3rem;
    text-align: right;
  }

  &__millisecond {
    width: 3.3rem;
    font-size: 0.8em;
  }
}
</style>