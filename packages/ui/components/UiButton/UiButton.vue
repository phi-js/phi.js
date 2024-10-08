<script setup>
import { computed, useAttrs, useSlots, ref, watch } from 'vue'
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


// Dampen isLoading value
// i.e. avoid flashing when isLoading changes back and forth too quickly
const isLoading = ref(props.isLoading)
let timeout = null

watch(
  () => props.isLoading,
  (newValue) => {
    clearTimeout(timeout)

    if (newValue) {
      // timeout = setTimeout(() => isLoading.value = true, 180)
      isLoading.value = true
    } else {
      isLoading.value = false
    }
  },
  { immediate: true },
)


// Get text from slot
const slots = useSlots()
const slotText = computed(() => slots?.default?.()?.[0]?.children)

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

  const retval = isLoading.value
    ? props.loadingLabel || props.label || $attrs.value || slotText.value
    : props.label || $attrs.value || slotText.value

  return retval || ' '
})
</script>

<template>
  <button
    type="button"
    class="UiButton UiButton--component"
    :class="{
      'UiButton--loading': isLoading,
      'UiButton--error': errors.length,
    }"
    :style="{
      '--ui-button-loading-label': `'${props.loadingLabel || currentText}'`
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