<script>
var _UiInput_counter = 0
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, useAttrs, ref, inject, watch, nextTick } from 'vue'
import { toHTMLProps } from './validation.js'
import types from './types.js'
import UiButton from '../UiButton/UiButton.vue'

const attrs = useAttrs()
const injectedTypes = inject('_ui_input_types', {})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'invalid', 'click', 'click-label'])

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
    type: [String, Number],
    required: false,
    default: '',
  },

  placeholder: {
    type: [String, Number],
    required: false,
    default: '',
  },

  subtext: {
    type: [String, Number],
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

  // Validation rules (see ./validation.js)
  rules: {
    type: Array,
    required: false,
    default: null,
  },
})

let timeout = null

const innerValue = ref()
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = newValue,
  { immediate: true },
)

function emitUpdate() {
  // hmmm
  // internal implementation of: https://vuejs.org/guide/essentials/forms.html#number
  if (props.type == 'number') {
    const numValue = parseFloat(innerValue.value)
    if (!isNaN(numValue) && innerValue.value !== numValue) {
      innerValue.value = numValue
    }
  }

  clearTimeout(timeout)
  if (props.debounce > 0 && innerValue.value) {
    timeout = setTimeout(() => emit('update:modelValue', innerValue.value), props.debounce)
  } else {
    emit('update:modelValue', innerValue.value)
  }
}


function isEmpty(testValue) {
  return testValue === null
    || testValue === undefined
    || testValue === ''
    || (Array.isArray(testValue) && !testValue.length)
}

const isValueEmpty = computed(() => isEmpty(innerValue.value))


// Validation management
// Use native html validation props and events
const isInvalid = ref(false)

function validateValue(value, rules = []) {
  if (!Array.isArray(rules)) {
    return null
  }

  if (isEmpty(value)) {
    return rules.find((r) => r.type == 'required')
  }

  for (let i = 0; i < rules.length; i++) {
    const rule = rules[i]
    if (rule.type == 'minlength' && value?.length < rule.value) {
      return rule
    }
    if (rule.type == 'maxlength' && value?.length > rule.value) {
      return rule
    }
    if (rule.type == 'pattern') {
      const regex = new RegExp(rule.value)
      if (!regex.test(value)) {
        return rule
      }
    }
  }

  return null
}

const validationProps = computed(() => {
  return {
    ...toHTMLProps(props.rules),

    onInvalid: (event) => {
      isInvalid.value = true
      const failedRule = validateValue(event.target.value, props.rules)
      if (failedRule) {
        event.target.setCustomValidity(failedRule?.message || '')
        emit('invalid', failedRule)
      }
    },
  }
})


// In order to validate required, minlength and maxlength for ARRAY values,
// an invisible <input> () is added.
// Since minlength and maxlength are NOT validated on values changed via JS (// https://stackoverflow.com/questions/53226031/html-input-validity-not-checked-when-value-is-changed-by-javascript)
// then minlength and maxlength are modelled via "pattern"
const validatorInput = ref()

const validatorInputProps = computed(() => {
  const retval = {
    ...validationProps.value,
    value: validableValue.value,
    onFocus: (evt) => evt.target.blur(),
  }

  if (retval.minlength || retval.maxlength) {
    const minLength = retval.minlength || 0
    const maxLength = retval.maxlength || ''

    retval.pattern = `.{${minLength},${maxLength}}`

    retval.minlength = undefined
    retval.maxlength = undefined
  }

  return retval
})

// Doesn't work for minlength and maxlength
// https://stackoverflow.com/questions/53226031/html-input-validity-not-checked-when-value-is-changed-by-javascript
const validableValue = computed(() => {
  if (isValueEmpty.value) {
    return ''
  }

  // The validable value of an array is a string of 'X's, which
  // are used validate minlength and maxlength
  if (Array.isArray(innerValue.value)) {
    return innerValue.value.map(() => 'x').join('')
  }

  return 'x'
})

watch(
  validableValue,
  () => {
    if (validatorInput.value) {
      nextTick(() => {
        validatorInput.value.setCustomValidity('')
        isInvalid.value = !validatorInput.value.checkValidity()
      })
    }
  },
)



// focus management
const isFocused = ref(false)
function setFocused(newValue, evt) {
  isFocused.value = newValue
  return isFocused.value ? emit('focus', evt) : emit('blur', evt)
}

const classNames = computed(() => {
  return [
    attrs.class,
    'UiInput',
    `UiInput--type-${props.type}`,
    {
      'UiInput--empty': isValueEmpty.value,
      'UiInput--full': !isValueEmpty.value,
      'UiInput--focused': isFocused.value,
      'UiInput--disabled': props.disabled,
      'UiInput--enabled': !props.disabled,
      'UiInput--required': props.required || validationProps.value?.required,
      'UiInput--invalid': props.errors.length > 0 || isInvalid.value,
    },
  ]
})

const customComponent = computed(() => {
  return types[props.type] || injectedTypes[props.type]
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
    'onUpdate:modelValue': (newValue) => {
      innerValue.value = newValue
      emitUpdate()
    },
  }
})

const nativeElementProps = computed(() => {
  return {
    ...elementProps.value,
    value: innerValue.value,
    onInput: (event) => {
      innerValue.value = event.target.value
      emitUpdate()

      event.target.setCustomValidity('')
      isInvalid.value = !event.target.checkValidity()
    },
    ...validationProps.value,

    modelValue: undefined,
    rules: undefined,
  }
})

const nativeCheckboxProps = computed(() => {
  return {
    ...elementProps.value,
    checked: !!innerValue.value,
    onInput: (event) => {
      innerValue.value = event.target.checked
      emitUpdate()
    },
  }
})

const element = ref()
defineExpose({
  element,
  focus: () => element?.value?.focus?.(),
  setCustomValidity: (a) => element?.value?.setCustomValidity?.(a),
  reportValidity: () => element?.value?.reportValidity?.(),
})

const uid = ref('UiInput' + (++_UiInput_counter))
</script>

<template>
  <template v-if="props.type == 'button' || props.type == 'submit'">
    <UiButton
      :type="type"
      :label="props.label"
      :disabled="props.disabled"

      v-bind="attrs"
      style="display:block"
      @click="emit('click', $event)"
    />
    <div
      v-if="$slots.subtext || props.subtext"
      class="UiInput__subtext"
    >
      <slot name="subtext">
        {{ props.subtext }}
      </slot>
    </div>
  </template>
  <div
    v-else
    :class="classNames"
    :style="attrs.style"
    @click="emit('click', $event)"
  >
    <label
      v-if="showLabel"
      class="UiInput__label"
      :for="uid"
      @click="emit('click-label', $event)"
      v-text="props.label"
    />

    <div class="UiInput__body">
      <slot name="default">
        <template v-if="customComponent">
          <component
            :is="customComponent"
            ref="element"
            v-bind="elementProps"
          />

          <!-- Invisible input field to handle native validations -->
          <label class="UiInput__validatorInput">
            <input
              :id="uid"
              ref="validatorInput"
              type="text"
              v-bind="validatorInputProps"
            >
          </label>
        </template>
        <textarea
          v-else-if="props.type == 'textarea'"
          :id="uid"
          ref="element"
          class="UiInput__element"
          v-bind="nativeElementProps"
        />
        <label
          v-else-if="props.type == 'checkbox'"
          :type="props.type"
        >
          <input
            v-bind="nativeCheckboxProps"
            :id="uid"
            ref="element"
            type="checkbox"
            class="UiInput__element"
          >
          <span>{{ props.placeholder }}</span>
        </label>
        <input
          v-else
          :id="uid"
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
        {{ err?.message || err }}
      </li>
    </ul>
  </div>
</template>