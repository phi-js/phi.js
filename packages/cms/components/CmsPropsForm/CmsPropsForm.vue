<script setup>
import { computed } from 'vue'
import { getProperty, setProperty } from '../../../ui/helpers'
import CmsPropInput from '../CmsPropInput/CmsPropInput.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
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
  <div class="CmsPropsForm">
    <CmsPropInput
      v-for="(field, i) in parsedFields"
      :key="i"
      class="CmsPropsForm__field"
      v-bind="field"
    />
  </div>
</template>