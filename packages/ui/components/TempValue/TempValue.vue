<script>
export default { inheritAttrs: false }
</script>
<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    required: false,
    validator: () => true,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const internalRefs = { modelValue: ref() }

watch(
  () => props.modelValue,
  (newValue) => internalRefs.modelValue.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true, deep: true },
)

function accept() {
  emit('update:modelValue', JSON.parse(JSON.stringify(internalRefs.modelValue.value)))
}

function cancel() {
  internalRefs.modelValue.value = JSON.parse(JSON.stringify(props.modelValue))
}
</script>

<template>
  <slot
    :tmp="internalRefs.modelValue"
    :accept="accept"
    :cancel="cancel"
  />
</template>