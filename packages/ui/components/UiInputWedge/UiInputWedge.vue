<script setup>
import { ref, watch } from 'vue'
import { UiIcon } from '../UiIcon'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false,
    default: null,
  },

  open: {
    type: [Boolean],
    required: false,
    default: false,
  },

  placeholder: {
    type: String,
    required: false,
    default: null,
  },

  icon: {
    type: String,
    required: false,
    default: 'mdi:variable',
  },

  color: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:open'])

const refInput = ref()
const refIcon = ref()
const innerOpen = ref(false)

watch(
  () => props.open,
  (newValue) => innerOpen.value = newValue,
  { immediate: true },
)

function setOpen(newValue) {
  innerOpen.value = newValue
  emit('update:open', innerOpen.value)

  if (innerOpen.value) {
    refInput.value.select()
  } else {
    refIcon.value.$el.focus()
  }
}

function onEnter(newValue) {
  emit('update:modelValue', newValue)
  setOpen(false)
}

function onEscape(inputEl) {
  inputEl.value = props.modelValue
  setOpen(false)
}
</script>

<template>
  <div
    class="UiInputWedge"
    :class="{ 'UiInputWedge--open': innerOpen, 'UiInputWedge--closed': !innerOpen }"
  >
    <UiIcon
      ref="refIcon"
      class="UiInputWedge__icon ui--clickable"
      :src="props.icon"
      :style="{ color: props.color }"
      tabindex="0"
      @click="setOpen(!innerOpen)"
      @keypress.enter="setOpen(!innerOpen)"
    />
    <input
      ref="refInput"
      type="text"
      class="UiInputWedge__input UiInput"
      :value="props.modelValue"
      tabindex="-1"
      :placeholder="props.placeholder"
      @keydown.esc="onEscape($event.target)"
      @keypress.enter="onEnter($event.target.value)"
    />
  </div>
</template>

<style lang="scss">
.UiInputWedge {
  display: inline-flex;
  flex-wrap: nowrap;
  align-items: stretch;

  overflow: hidden;
  max-width: 42px;
  transition: all var(--ui-duration-snap);

  &__icon {
    width: 42px;
    min-width: 42px;
  }

  &__input {
    flex: 1;
  }

  &--open {
    max-width: 250px;
  }
}
</style>