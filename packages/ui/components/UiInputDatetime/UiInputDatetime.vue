<script setup>
import { computed, ref, useAttrs, watch } from 'vue'

const props = defineProps({
  /*
  Valid datetime-local date: e.g. 2023-01-01T16:20
  */
  modelValue: {
    type: String,
    required: false,
    default: '',
  },

  // Time step IN MINUTES (1, 15, 30)
  timeStep: {
    type: [String, Number],
    required: false,
    default: 15,
  },

  // Hour:minute string (00:00 to 23:59)
  timeMin: {
    type: String,
    required: false,
    default: '00:00',
  },

  // Hour:minute string (00:00 to 23:59)
  timeMax: {
    type: String,
    required: false,
    default: '23:59',
  },
})

const emit = defineEmits(['update:modelValue'])

const inner = ref({
  date: '',
  time: '',
})

watch(
  () => props.modelValue,
  () => {
    const parts = props.modelValue?.split
      ? props.modelValue.split('T')
      : []

    inner.value.date = parts?.[0] || inner.value.date
    inner.value.time = parts?.[1] || inner.value.time
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', inner.value.date && inner.value.time
    ? `${inner.value.date}T${inner.value.time}`
    : '')
}

const timeOptions = computed(() => {
  const slots = []
  let current = new Date(`1970-01-01T${props.timeMin}:00`)
  const max = new Date(`1970-01-01T${props.timeMax}:00`)
  const step = parseInt(props.timeStep) * 60000 // convert minutes to milliseconds

  while (current <= max) {
    const text = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const value = text.substring(0, 5)
    slots.push({ text: text, value: value })
    current.setTime(current.getTime() + step)
  }

  return slots
})

const attrs = useAttrs()

function sanitizeIsoDateString(strIsoDate) {
  if (!strIsoDate) {
    return ''
  }
  return strIsoDate.split('T')?.[0] || ''
}

const inputDateAttrs = computed(() => {
  return {
    required: attrs.required,
    min: attrs.min ? sanitizeIsoDateString(attrs.min) : '',
    max: attrs.max ? sanitizeIsoDateString(attrs.max) : '',
  }
})
</script>

<template>
  <div class="UiInputDatetime">
    <input
      v-model="inner.date"
      class="UiInput__element"
      type="date"
      v-bind="inputDateAttrs"
      @update:model-value="emitUpdate"
    >
    <select
      v-model="inner.time"
      class="UiInput__element"
      :required="attrs.required"
      @update:model-value="emitUpdate"
    >
      <option
        v-for="opt in timeOptions"
        :key="opt.value"
        :value="opt.value"
        v-text="opt.text"
      />
    </select>
  </div>
</template>