<script setup>
import { computed, useAttrs, useSlots } from 'vue'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'

const $attrs = useAttrs()

const props = defineProps({
  label: {
    type: String,
    required: false,
    default: '',
  },

  icon: {
    type: String,
    required: false,
    default: null,
  },

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  loadingLabel: {
    type: String,
    required: false,
    default: '',
  },

  error: {
    type: [String, Array],
    required: false,
    default: null,
  },
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

// Displayer button label
const currentText = computed(() => {
  if (errors.value.length) {
    return errors.value[0]
  }

  const retval = props.isLoading
    ? props.loadingLabel || props.label || $attrs.value || slotText
    : props.label || $attrs.value || slotText

  return retval || ' '
})
</script>

<template>
  <button
    type="button"
    class="UiButton UiButton--component"
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
      :badge="$attrs.badge"
    >
      <template #actions>
        <UiIcon src="mdi:timer-sand" />
      </template>
    </UiItem>
  </button>
</template>