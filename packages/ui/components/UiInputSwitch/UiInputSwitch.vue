<script setup>
import { UiIcon } from '../UiIcon'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean],
    required: false,
    default: null,
  },

  iconTrue: {
    type: String,
    required: false,
    default: null,
  },

  iconFalse: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:model-value'])
</script>

<template>
  <div
    class="UiInputSwitch"
    :class="{
      'UiInputSwitch--checked': props.modelValue,
      'UiInputSwitch--unchecked': !props.modelValue,
    }"
    @click="emit('update:model-value', !props.modelValue)"
  >
    <div class="UiInputSwitch__icon">
      <UiIcon
        v-if="props.modelValue ? props.iconTrue : props.iconFalse"
        :src="props.modelValue ? props.iconTrue : props.iconFalse"
      />
    </div>
  </div>
</template>