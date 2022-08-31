<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: () => ['', ''],
  },
})

const emit = defineEmits(['update:modelValue'])

const startDate = computed({
  get: () => props.modelValue?.[0] || '',
  set: (newValue) => emit('update:modelValue', sanitizeRange(newValue, props.modelValue?.[1], 'start')),
})

const endDate = computed({
  get: () => props.modelValue?.[1] || '',
  set: (newValue) => emit('update:modelValue', sanitizeRange(props.modelValue?.[0], newValue, 'end')),
})

function sanitizeRange(strStartDate, strEndDate, priority = 'start') {
  if (strStartDate > strEndDate) {
    if (priority == 'start') {
      strEndDate = strStartDate
    } else {
      strStartDate = strEndDate
    }
  }
  return [strStartDate || '', strEndDate || '']
}
</script>

<template>
  <span class="UiInputDateRange">
    <input
      v-model="startDate"
      type="date"
      class="UiInput__element"
    >
    -
    <input
      v-model="endDate"
      type="date"
      class="UiInput__element"
      :min="startDate"
    >
  </span>
</template>