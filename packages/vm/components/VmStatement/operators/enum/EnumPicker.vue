<script setup>
import { computed } from 'vue'
import { UiInput } from '/packages/ui/components'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: () => [],
  },

  fieldSchema: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const arrValue = computed({
  get() {
    return Array.isArray(props.modelValue) ? props.modelValue : (props.modelValue !== null ? [props.modelValue] : [])
  },
  set(newValue) {
    emit('update:modelValue', newValue)
  },
})

const enumOptions = computed(() => {
  return props.fieldSchema?.enum || props.fieldSchema?.items?.enum || []
})

</script>

<template>
  <UiInput
    v-model="arrValue"
    multiple
    type="select-list"
    :options="enumOptions"
  />
</template>