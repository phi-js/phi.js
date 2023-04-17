<script setup>
import { UiInputCode } from '@/packages/ui/components'

const props = defineProps({
  // BLOCK object
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function emitUpdate(html) {
  emit('update:modelValue', {
    ...props.modelValue,
    props: {
      ...props.modelValue?.props,
      value: html,
    },
  })
}

</script>

<template>
  <UiInputCode
    lang="html"
    :model-value="modelValue.props.value"
    @update:model-value="emitUpdate($event)"
  />
</template>