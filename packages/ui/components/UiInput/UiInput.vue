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
    `ui-input--type-${props.type}`,
    {
      'ui-input--empty': isEmpty,
      'ui-input--full': !isEmpty,
      'ui-input--focused': isFocused.value,
      'ui-input--disabled': props.disabled,
      'ui-input--enabled': !props.disabled,
      'ui-input--required': props.required,
      'ui-input--invalid': props.errors.length > 0,
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
    class="ui-input"
    :class="classNames"
    :style="attrs.style"
  >
    <label
      v-if="showLabel"
      class="ui-input__label"
      v-text="props.label"
    />

    <div class="ui-input__body">
      <slot name="default">
        <component
          :is="customComponent"
          v-if="customComponent"
          class="ui-input__elem"
          v-bind="elementProps"
        />
        <textarea
          v-else-if="props.type == 'textarea'"
          class="ui-input__elem ui-native"
          v-bind="nativeElementProps"
        />
        <button
          v-else-if="props.type == 'button'"
          type="button"
          class="ui-input__elem ui-native"
          v-bind="nativeElementProps"
          v-text="props.label"
        />
        <label
          v-else-if="props.type == 'checkbox'"
          class="ui-input__elem ui-noselect"
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
          class="ui-input__elem ui-native"
          :type="props.type"
          v-bind="nativeElementProps"
        >
      </slot>
    </div>
    <div
      class="ui-input__subtext"
      v-text="props.subtext"
    />
  </div>
</template>
