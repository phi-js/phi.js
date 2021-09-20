<script setup>
import { computed, useAttrs, ref } from 'vue'
import types from './types.js'

const props = defineProps({
  type: {
    type: String,
    required: false,
    default: 'text'
  },

  value: {
    type: [String, Number, Boolean],
    required: false,
    default: null
  },

  label: {
    type: String,
    required: false,
    default: ''
  },

  placeholder: {
    type: String,
    required: false,
    default: ''
  },

  subtext: {
    type: String,
    required: false,
    default: ''
  },

  disabled: {
    type: Boolean,
    default: false
  },

  required: {
    type: Boolean,
    default: false
  },

  errors: {
    type: Array,
    required: false,
    default: () => []
  }
})

// focus management
const isFocused = ref(false)
function setFocused(newValue) {
  return (isFocused.value = newValue)
}

const classNames = computed(() => [
  `ui-input--type-${props.type}`,
  {
    'ui-input--empty': !props.value && !props.value?.length,
    'ui-input--focused': isFocused.value,
    'ui-input--disabled': props.disabled,
    'ui-input--enabled': !props.disabled,
    'ui-input--required': props.required,
    'ui-input--invalid': props.errors.length > 0
  }
])

const customComponent = computed(() => {
  return types[props.type]
})

const showLabel = computed(() => {
  return props.type != 'button'
})

const elementProps = computed(() => {
  return {
    ...useAttrs(),
    ...props,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }
})
</script>

<template>
  <div class="ui-input" :class="classNames">
    <label
      v-if="showLabel"
      class="ui-input__label"
      v-text="props.label"
    ></label>

    <div class="ui-input__body">
      <slot name="default">
        <component
          :is="customComponent"
          v-if="customComponent"
          v-bind="elementProps"
        ></component>
        <textarea
          v-else-if="props.type == 'textarea'"
          class="ui-input__elem ui-native"
          v-bind="elementProps"
        ></textarea>
        <button
          v-else-if="props.type == 'button'"
          type="button"
          class="ui-input__elem ui-native"
          v-bind="elementProps"
          v-text="props.label"
        ></button>
        <label
          v-else-if="props.type == 'checkbox'"
          class="ui-input__elem ui-noselect"
          :type="props.type"
          ><input type="checkbox" v-bind="elementProps" /><span>{{
            props.placeholder
          }}</span></label
        >
        <input
          v-else
          class="ui-input__elem ui-native"
          :type="props.type"
          v-bind="elementProps"
        />
      </slot>
    </div>
    <div class="ui-input__footer"></div>
  </div>
</template>
