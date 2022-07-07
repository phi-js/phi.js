<script setup>
import { computed } from 'vue'
import { UiInput } from '@/packages/ui/components'

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

function getOptions(schema) {
  if (schema?.items) {
    return getOptions(schema.items)
  }

  if (Array.isArray(schema?.oneOf)) {
    return schema.oneOf.map((item) => ({
      value: item?.const,
      text: item?.title,
    }))
  }

  if (Array.isArray(schema?.enum)) {
    return schema.enum.map((item) => {
      if (typeof item == 'object') {
        return {
          value: item?.value,
          text: item?.text,
        }
      }
      return { value: item, text: item }
    })
  }

  return []
}

const enumOptions = computed(() => getOptions(props.fieldSchema))
</script>

<template>
  <UiInput
    v-model="arrValue"
    multiple
    type="select-list"
    :options="enumOptions"
  />
</template>