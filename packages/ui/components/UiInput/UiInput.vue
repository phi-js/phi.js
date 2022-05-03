<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, useAttrs, ref } from 'vue'
import types from './types.js'
import UiButton from '../UiButton/UiButton.vue'

const attrs = useAttrs()
const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

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
    type: [Boolean, String, Number],
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

  debounce: {
    type: [String, Number],
    required: false,
    default: 0,
  },
})

let timeout = null

function emitUpdate(newValue) {
  clearTimeout(timeout)
  if (props.debounce > 0) {
    timeout = setTimeout(() => emit('update:modelValue', newValue), props.debounce)
  } else {
    emit('update:modelValue', newValue)
  }
}

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
  return props.label && props.type != 'button' && props.type != 'submit'
})

const elementProps = computed(() => {
  return {
    ...props,
    ...attrs,
    'class': undefined,
    'style': undefined,
    'onFocus': (evt) => setFocused(true, evt),
    'onBlur': (evt) => setFocused(false, evt),
    'onUpdate:modelValue': (newValue) => emitUpdate(newValue),
  }
})

const nativeElementProps = computed(() => {
  return {
    ...elementProps.value,
    value: elementProps.value?.modelValue,
    onInput: (event) => emitUpdate(event.target.value),
  }
})

const nativeCheckboxProps = computed(() => {
  return {
    ...elementProps.value,
    checked: elementProps.value?.modelValue,
    onInput: (event) => emitUpdate(event.target.checked),
  }
})

const element = ref()
defineExpose({
  element,
  focus: () => element?.value?.focus?.(),
})
</script>

<template>
  <UiButton
    v-if="props.type == 'button' || props.type == 'submit'"
    :type="type"
    :label="props.label"
    :disabled="props.disabled"
    v-bind="attrs"
  />
  <div
    v-else
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
          ref="element"
          v-bind="elementProps"
        />
        <textarea
          v-else-if="props.type == 'textarea'"
          ref="element"
          class="UiInput__element"
          v-bind="nativeElementProps"
        />
        <label
          v-else-if="props.type == 'checkbox'"
          class="UiInput__element"
          :type="props.type"
        >
          <input
            v-bind="nativeCheckboxProps"
            ref="element"
            type="checkbox"
          >
          <span>{{ props.placeholder }}</span>
        </label>
        <input
          v-else
          v-bind="nativeElementProps"
          ref="element"
          class="UiInput__element"
          :type="props.type"
        >
      </slot>
    </div>
    <div
      v-if="$slots.subtext || props.subtext"
      class="UiInput__subtext"
    >
      <slot name="subtext">
        {{ props.subtext }}
      </slot>
    </div>

    <ul
      v-if="props.errors.length"
      class="UiInput__errors"
    >
      <li
        v-for="(err, k) in props.errors"
        :key="k"
      >
        {{ err.message }}
      </li>
    </ul>
  </div>
</template>