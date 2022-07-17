<script setup>
import { ref, watch, toRef } from 'vue'
import { UiItem } from '../UiItem'
import useOptionsManager from '../UiSelect/composables/useOptionsManager.js'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

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

  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emit = defineEmits(['update:modelValue'])

const refEl = ref()
const innerValue = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = Array.isArray(newValue) ? newValue : [newValue]
  },
  { immediate: true },
)

function toggleValue(value) {
  let foundIndex = innerValue.value.findIndex((e) => e === value)
  if (foundIndex >= 0) {
    innerValue.value.splice(foundIndex, 1)
  } else {
    if (props.multiple) {
      innerValue.value.push(value)
    } else {
      innerValue.value = [value]
    }
  }
  emit(
    'update:modelValue',
    props.multiple ? innerValue.value : innerValue.value[0],
  )

  // Emit native form change event.
  // All Ui***Input components should either contain native html inputs or behave EXACTLY like them
  refEl.value.dispatchEvent(new Event('change', { bubbles: true }))
}

const { options } = useOptionsManager(toRef(props, 'options'), {
  optionText: props.optionText,
  optionValue: props.optionValue,
  optionSearch: props.optionSearch,
})
</script>

<template>
  <div
    ref="refEl"
    class="UiSelectButtons UiGroup"
  >
    <UiItem
      v-for="option in options"
      :key="option.value"
      v-bind="option"
      :value="option.value"
      class="UiSelectButtons__button"
      :class="{
        'UiSelectButtons__button--selected': innerValue.includes(option.value)
      }"
      @click="toggleValue(option.value)"
    />
  </div>
</template>

<style lang="scss">
.UiSelectButtons {
  &__button {
    cursor: pointer;
    white-space: nowrap;

    font-size: inherit;
    --ui-item-padding: 8px 16px;

    background-color: var(--ui-color-z1);
    color: #999;

    border: 0;
    border-radius: 0;

    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:hover {
      background-color: var(--ui-color-hover);
    }

    &--selected,
    &--selected:hover {
      background: var(--ui-color-primary);
      color: #fff;
    }
  }
}
</style>
