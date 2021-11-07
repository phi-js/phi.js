<script setup>
import { computed } from 'vue'
import { UiIcon } from '../../../../../ui'

const props = defineProps({
  /* objeto PROPS para MediaImage:

    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    width: 'auto',
    href: 'https://phidias.co',
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])

const isFullWidth = computed({
  get() {
    return props.modelValue?.width == '100%'
  },

  set(newValue) {
    const targetValue = newValue ? '100%' : 'auto'
    emit('update:modelValue', { ...props.modelValue, width: targetValue })
  },
})
</script>

<template>
  <div class="MediaImageToolbar ui-group">
    <UiIcon
      title="Align left"
      src="mdi:format-align-left"
      class="MediaImageToolbar__icon ui--clickable"
      :class="{'--active': props.modelValue.align == 'left'}"
      @click="emit('update:modelValue', { ...props.modelValue, align: 'left' })"
    />
    <UiIcon
      title="Align center"
      src="mdi:format-align-center"
      class="MediaImageToolbar__icon ui--clickable"
      :class="{'--active': props.modelValue.align == 'center'}"
      @click="emit('update:modelValue', { ...props.modelValue, align: 'center' })"
    />
    <UiIcon
      title="Align right"
      src="mdi:format-align-right"
      class="MediaImageToolbar__icon ui--clickable"
      :class="{'--active': props.modelValue.align == 'right'}"
      @click="emit('update:modelValue', { ...props.modelValue, align: 'right' })"
    />

    <UiIcon
      title="Full width"
      src="mdi:overscan"
      class="MediaImageToolbar__icon ui--clickable"
      :class="{'--active': isFullWidth}"
      @click="isFullWidth = !isFullWidth"
    />
  </div>
</template>