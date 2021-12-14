<script>
export default {
  name: 'UiSelectNative',
  inheritAttrs: false,
}
</script>

<script setup>
import { toRef, computed } from 'vue'
import useOptionsManager from '../UiSelect/composables/useOptionsManager.js'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },

  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  placeholder: {
    type: String,
    required: false,
    default: '',
  },

  /**
   * An array of arbitrary objects to be uased as a source for options
   */
  options: {
    type: Array,
    required: false,
    default: () => [],
  },

  /**
   * A JSON PATH string pointing to the item property
   * to be used as a scalar VALUE identifier
   *
   * @default '$.value'
   */
  optionValue: {
    type: String,
    required: false,
    default: null,
  },

  /**
   * A JSON PATH string pointing to the item property
   * to be used as a scalar TEXT identifier
   *
   * @default '$.text'
   */
  optionText: {
    type: String,
    required: false,
    default: null,
  },

  optionSearch: {
    type: [String, Array],
    required: false,
    default: null,
  },
})

const { options } = useOptionsManager(toRef(props, 'options'), {
  optionText: props.optionText,
  optionValue: props.optionValue,
})

const proxyValue = computed({
  get: () => props.modelValue,
  set: (newValue) => emit('update:modelValue', newValue),
})
</script>

<template>
  <select
    v-model="proxyValue"
    class="UiSelectNative ui__input"
    :multiple="!!props.multiple"
  >
    <option
      v-if="props.placeholder && !props.multiple"
      :value="null"
    >
      {{ props.placeholder }}
    </option>

    <option
      v-for="option in options"
      :key="option.value"
      :text="option.text"
      :value="option.value"
    />
  </select>
</template>
