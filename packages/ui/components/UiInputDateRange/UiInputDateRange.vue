<script setup>
import { computed } from 'vue'
import { toDate } from '../../helpers'

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


/*
Convierte "cualquier valor" a una cadena "yyyy-mm-dd" (valor valido para usar en <input type="date" value="XXXXX" />)

ej toDateValue(131232131) // unix timestamp
ej toDateValue('1982-01-15')
*/
function toDateValue(incoming) {
  const d = toDate(incoming)
  if (!d) {
    return ''
  }

  return d.toISOString()
    .padStart(24, '0')
    .split('T')[0]
}

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
  get: () => toDateValue(props.modelValue?.[0]),
  set: (newValue) => emit('update:modelValue', sanitizeRange(newValue, toDateValue(props.modelValue?.[1]), 'start')),
})

const endDate = computed({
  get: () => toDateValue(props.modelValue?.[1]),
  set: (newValue) => emit('update:modelValue', sanitizeRange(toDateValue(props.modelValue?.[0]), newValue, 'end')),
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
</script>

<template>
  <span class="UiInputDateRange">
    <input
      v-bind="{...$attrs, class:null, style:null}"
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