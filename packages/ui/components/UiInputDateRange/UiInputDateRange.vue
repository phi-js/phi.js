<script setup>
import { computed, useAttrs } from 'vue'
import { toDateString } from '../../helpers'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: () => ['', ''],
  },

  format: {
    type: String,
    required: false,
    default: null, // null | "timestamp"
  },
})

const emit = defineEmits(['update:modelValue'])

function toOutputValue(strDate) {
  if (!strDate) {
    return ''
  }
  if (props.format == 'timestamp') {
    return Math.floor(new Date(strDate).getTime() / 1000)
  }
  return strDate
}

const startDate = computed({
  get: () => toDateString(props.modelValue?.[0]),
  set: (newValue) => emit('update:modelValue', sanitizeRange(newValue, toDateString(props.modelValue?.[1]), 'start')),
})

const endDate = computed({
  get: () => toDateString(props.modelValue?.[1]),
  set: (newValue) => emit('update:modelValue', sanitizeRange(toDateString(props.modelValue?.[0]), newValue, 'end')),
})

function sanitizeRange(strStartDate, strEndDate, priority = 'start') {
  if (strStartDate > strEndDate || !strEndDate) {
    if (priority == 'start') {
      strEndDate = strStartDate
    } else {
      strStartDate = strEndDate
    }
  }

  return [
    toOutputValue(strStartDate),
    toOutputValue(strEndDate),
  ]
}

const attrs = useAttrs()

function sanitizeIsoDateString(strIsoDate) {
  if (!strIsoDate) {
    return ''
  }
  return strIsoDate.split('T')?.[0] || ''
}

const startDateAttrs = computed(() => {
  return {
    ...attrs,
    min: sanitizeIsoDateString(attrs.min),
    max: sanitizeIsoDateString(attrs.max),
    class: null,
    style: null,
  }
})
</script>

<template>
  <span class="UiInputDateRange">
    <input
      v-bind="startDateAttrs"
      v-model="startDate"
      type="date"
      class="UiInput__element"
    >
    -
    <input
      v-model="endDate"
      type="date"
      class="UiInput__element"
      :min="startDate || startDateAttrs.min"
      :max="$attrs.max"
    >
  </span>
</template>