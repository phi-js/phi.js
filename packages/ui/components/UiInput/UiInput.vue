<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, useAttrs, ref } from 'vue'
import types from './types.js'

const attrs = useAttrs()

// eslint-disable-next-line no-undef
const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

// eslint-disable-next-line no-undef
const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'text',
  },

  modelValue: {
    type: [String, Number, Boolean, Object, Array, Date],
    required: false,
    default: null,
  },

  label: {
    type: String,
    required: false,
    default: '',
  },

  placeholder: {
    type: String,
    required: false,
    default: '',
  },

  subtext: {
    type: String,
    required: false,
    default: '',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  required: {
    type: Boolean,
    default: false,
  },

  errors: {
    type: Array,
    required: false,
    default: () => [],
  },
})

// focus management
const isFocused = ref(false)
function setFocused(newValue, evt) {
  isFocused.value = newValue
  return isFocused.value ? emit('focus', evt) : emit('blur', evt)
}

const classNames = computed(() => {
  let isEmpty =
    props.modelValue === null ||
    props.modelValue === undefined ||
    props.modelValue === '' ||
    (Array.isArray(props.modelValue) && !props.modelValue.length)

  return [
    attrs.class,
    `UiInput--type-${props.type}`,
    {
      'UiInput--empty': isEmpty,
      'UiInput--full': !isEmpty,
      'UiInput--focused': isFocused.value,
      'UiInput--disabled': props.disabled,
      'UiInput--enabled': !props.disabled,
      'UiInput--required': props.required,
      'UiInput--invalid': props.errors.length > 0,
    },
  ]
})

const customComponent = computed(() => {
  return types[props.type]
})

const showLabel = computed(() => {
  return props.type != 'button'
})

const elementProps = computed(() => {
  return {
    ...props,
    ...attrs,
    'class': undefined,
    'style': undefined,
    'onFocus': (evt) => setFocused(true, evt),
    'onBlur': (evt) => setFocused(false, evt),
    'onUpdate:modelValue': (newValue) => emit('update:modelValue', newValue),
  }
})

const nativeElementProps = computed(() => {
  return {
    ...elementProps.value,
    value: elementProps.value?.modelValue,
    onInput: (event) => emit('update:modelValue', event.target.value),
  }
})

const nativeCheckboxProps = computed(() => {
  return {
    ...elementProps.value,
    checked: elementProps.value?.modelValue,
    onInput: (event) => emit('update:modelValue', event.target.checked),
  }
})
</script>

<template>
  <div
    class="UiInput"
    :class="classNames"
    :style="attrs.style"
  >
    <label
      v-if="showLabel"
      class="UiInput__label"
      v-text="props.label"
    />

    <div class="UiInput__body">
      <slot name="default">
        <component
          :is="customComponent"
          v-if="customComponent"
          class="UiInput__elem"
          v-bind="elementProps"
        />
        <textarea
          v-else-if="props.type == 'textarea'"
          class="UiInput__elem ui__input"
          v-bind="nativeElementProps"
        />
        <button
          v-else-if="props.type == 'button'"
          type="button"
          class="UiInput__elem ui__button"
          v-bind="nativeElementProps"
          v-text="props.label"
        />
        <label
          v-else-if="props.type == 'checkbox'"
          class="UiInput__elem ui--noselect"
          :type="props.type"
        >
          <input
            type="checkbox"
            v-bind="nativeCheckboxProps"
          ><span>{{
            props.placeholder
          }}</span></label>
        <input
          v-else
          class="UiInput__elem ui__input"
          :type="props.type"
          v-bind="nativeElementProps"
        >
      </slot>
    </div>
    <div
      class="UiInput__subtext"
      v-text="props.subtext"
    />
  </div>
</template>
