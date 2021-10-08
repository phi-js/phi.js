<script setup>
import { computed } from 'vue'
import { UiInput } from '../UiInput'
import { setProperty, getProperty } from '../../helpers'

const props = defineProps({
  modelValue: {
    required: false,
    default: null,
    validator: () => true,
  },

  fields: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const parsedFields = computed(() => {
  return props.fields.map((field) => ({
    ...field,
    'modelValue': field.model ? getProperty(props.modelValue, field.model) : undefined,
    'onUpdate:modelValue': field.model ? (newValue) => {
      const clone = JSON.parse(JSON.stringify(props.modelValue))
      emit('update:modelValue', setProperty(clone, field.model, newValue))
    } : undefined,
  }))
})

</script>

<template>
  <div class="UiForm">
    <UiInput
      v-for="(field, i) in parsedFields"
      :key="i"
      class="UiForm__field"
      v-bind="field"
    />
  </div>
</template>