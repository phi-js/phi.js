<script setup>
import { UiInput } from '../../UiInput'

const props = defineProps({
  /*
  Value of CSS color property.  <color>
  rgba(), #fffff, var(--...), transparent, initial, revert, unset, etc
  */
  modelValue: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="CssTypeColor">
    <UiInput
      type="color-css"
      :model-value="props.modelValue"
      @update:model-value="$event => emit('update:modelValue', $event)"
    />
    <UiInput
      type="select-buttons"
      :model-value="props.modelValue"
      :options="[
        'transparent',
        'auto',
      ]"
      @update:model-value="$event => emit('update:modelValue', $event)"
    />
  </div>
</template>