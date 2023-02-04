<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui/components'

const props = defineProps({
  /* Objeto PROPS del bloque:
  {
    options: [] // arreglo de opciones
    multiple: true/false
    type: 'select' | 'select-native' | 'select-list', | 'select-buttons'
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerOptions = ref([])
watch(
  () => props.modelValue?.options,
  (newValue) => innerOptions.value = Array.isArray(newValue) ? newValue : [],
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    options: [...innerOptions.value],
  })
}
</script>

<template>
  <div
    class="SelectEditor"
    :class="`SelectEditor--type-${modelValue.type}`"
  >
    <UiInput
      class="SelectEditor__preview"
      v-bind="{ ...modelValue, style: undefined }"
      :options="innerOptions"
      label
    />
  </div>
</template>

<style lang="scss">
.SelectEditor {
  &--type-select,
  &--type-select-native,
  &--type-select-buttons {
    .SelectEditor__body {
      background-color: rgba(0, 0, 0, 0.035);
    }
  }
}
</style>