<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '/packages/ui/components'

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
      label=""
    />
  </div>
</template>

<style lang="scss">
.SelectEditor {
  &__option-item {
    .ui-item__icon {
      cursor: move;
    }
  }

  &--type-select,
  &--type-select-native,
  // &--type-select-list,
  &--type-select-buttons {
    .SelectEditor__body {
      border-radius: var(--ui-radius);
      background-color: rgba(0,0,0, .035);
      margin: var(--ui-breathe) 0;
    }
  }

  // &--type-select,
  // &--type-select-native {
  //   .SelectEditor__body {
  //     max-width: 440px;

  //     // Estilos de tippy-box
  //     border-radius: 4px;
  //     font-size: 14px;
  //     line-height: 1.4;
  //     white-space: normal;
  //     outline: 0;
  //     transition-property: transform,visibility,opacity;
  //     background-color: #fff;
  //     background-clip: padding-box;
  //     border: 1px solid rgba(0,8,16,.15);
  //     color: #333;
  //     box-shadow: 0 4px 14px -2px rgb(0 8 16 / 8%);
  //   }
  // }
}
</style>