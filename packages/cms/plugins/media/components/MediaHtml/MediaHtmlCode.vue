<script setup>
import UiInputCode from '../../../../../ui/components/UiInputCode/UiInputCode.vue'

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
  <div>
    <UiInputCode
      lang="html"
      :model-value="modelValue.props.value"
      @update:model-value="emitUpdate($event)"
    />
  </div>
</template>