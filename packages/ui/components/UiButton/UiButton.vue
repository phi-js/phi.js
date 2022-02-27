<script setup>
import '../../style/blocks/UiButton.scss'

import { computed, useAttrs, useSlots } from 'vue'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'

const $attrs = useAttrs()

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: ''
  },

  icon: {
    type: String,
    required: false,
    default: null
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },

  loadingText: {
    type: String,
    required: false,
    default: ''
  },

  error: {
    type: [String, Array],
    required: false,
    default: null
  }
})

// Get text from slot
const slots = useSlots()
const slotText = slots?.default?.()?.[0]?.children

// (arr)errors An array of error strings
const errors = computed(() => {
  if (!props.error || !props.error?.length) {
    return []
  }

  return Array.isArray(props.error) ? props.error : [props.error]
})

// Displayer button text
const currentText = computed(() => {
  if (errors.value.length) {
    return errors.value[0]
  }

  return props.isLoading
    ? props.loadingText || props.text || $attrs.value || slotText
    : props.text || $attrs.value || slotText
})
</script>

<template>
  <button
    type="button"
    class="UiButton"
    :class="{
      'UiButton--loading': props.isLoading,
      'UiButton--error': errors.length,
    }"
    v-bind="$attrs"
  >
    <UiItem
      :icon="errors.length ? 'mdi:alert-circle' : props.icon"
      :text="currentText"
      :subtext="$attrs.subtext"
    >
      <template #actions>
        <UiIcon src="mdi:timer-sand" />
      </template>
    </UiItem>
  </button>
</template>