<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null
  },

  options: {
    type: Array,
    required: false,
    default: () => []
  },

  multiple: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['update:modelValue'])

const innerValue = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = Array.isArray(newValue) ? newValue : [newValue]
  },
  { immediate: true }
)

function toggleValue(value) {
  let foundIndex = innerValue.value.findIndex((e) => e === value)
  if (foundIndex >= 0) {
    innerValue.value.splice(foundIndex, 1)
  } else {
    if (props.multiple) {
      innerValue.value.push(value)
    } else {
      innerValue.value = [value]
    }
  }
  emit(
    'update:modelValue',
    props.multiple ? innerValue.value : innerValue.value[0]
  )
}
</script>

<template>
  <div class="UiSelectButtons ui-group">
    <button
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      type="button"
      class="UiSelectButtons__button ui-button"
      :class="{
        'UiSelectButtons__button--selected': innerValue.includes(option.value)
      }"
      @click="toggleValue(option.value)"
      v-text="option.text"
    ></button>
  </div>
</template>

<style lang="scss">
.UiSelectButtons {
  &__button {
    &--selected {
      background: var(--ui-color-primary);
      color: #fff;
    }
  }
}
</style>
