<script setup>
import { ref, toRef, computed } from 'vue'
import { UiItem } from '../UiItem'
import useOptionsManager from '../UiSelect/composables/useOptionsManager.js'
import useSelectionManager from '../UiSelect/composables/useSelectionManager.js'

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
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

const refEl = ref()

const { options } = useOptionsManager(toRef(props, 'options'), {
  optionText: props.optionText,
  optionValue: props.optionValue,
  optionSearch: props.optionSearch,
})

const { isSelected, toggle } = useSelectionManager(
  toRef(props, 'modelValue'),
  toRef(props, 'multiple'),
  (newValue) => {
    emit('update:modelValue', newValue)
    refEl.value.dispatchEvent(new Event('change', { bubbles: true }))
  },
)

// Nice tidy list of listed options
const arrOptions = computed(() =>
  options.value.map((option) => {
    const _sel = isSelected(option.value)
    let icon = ''
    if (props.multiple) {
      icon = _sel ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'
    } else {
      icon = _sel ? 'mdi:radiobox-marked' : 'mdi:radiobox-blank'
    }

    return {
      ...option,
      text: option.text || option.value,
      icon,
    }
  }))
</script>

<template>
  <div
    ref="refEl"
    class="UiSelectList"
  >
    <UiItem
      v-for="option in arrOptions"
      :key="option.value"
      v-bind="option"
      class="UiSelectItem"
      :class="{'UiSelectItem--selected': isSelected(option.value)}"
      tabindex="0"
      @click="toggle(option.value)"
      @keydown.enter="toggle(option.value)"
      @keydown.space.prevent="toggle(option.value)"
      @keydown.arrow-up.prevent="$event.target.previousElementSibling?.focus()"
      @keydown.arrow-down.prevent="$event.target.nextElementSibling?.focus()"
    />
  </div>
</template>
