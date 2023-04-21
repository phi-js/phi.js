<script setup>
import { nextTick, ref, watch, computed } from 'vue'
import { UiInput, UiPopover } from '@/packages/ui'

const props = defineProps({
  /*
  STRING. A css UNIT value
  e.g:.  "12px", "50%", "auto", "none", null (a.k.a. 'default')
  */
  modelValue: {
    type: [String, Number],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({
  value: null,
  units: null,
})

watch(
  () => props.modelValue,
  () => innerValue.value = parseUnits(props.modelValue),
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', toUnitString(innerValue.value))
}

/*
Determines "value" and "units" for the given string

parseValue("12px") -> {value: 12, units: 'px'}
parseValue("50%") -> {value: 50, units: '%'}
parseValue("auto") -> {value: 'auto', units: null}
parseValue("none") -> {value: 'none', units: null}
parseValue(null) -> {value: null, units: null}
*/
function parseUnits(str) {
  const parsedValue = parseFloat(str)
  if (isNaN(parsedValue)) {
    return {
      value: str,
      units: null,
    }
  }

  return {
    value: parsedValue,
    units: str.toString().replace(parsedValue, '').trim() || null,
  }
}

/*
Given a {value, units} object, returns a unit string

toUnitStrig({value: 12, units: 'px'}) -> '12px'
toUnitStrig({value: 50, units: '5'}) -> '50%'
toUnitStrig({value: 'auto', units: null}) -> 'auto'
toUnitStrig({value: null, units: null}) -> null
toUnitStrig({value: null, units: null}, 'defaultValue') -> 'defaultValue'
*/

function toUnitString(obj, defaultValue = null) {
  if (obj.value === null) {
    return defaultValue
  }

  return `${obj.value}${obj.units || ''}`
}

const unitOptions = [
  { value: null, text: 'default' },
  { value: 'auto', text: 'auto' },
  { value: '%', text: '%' },
  { value: 'px', text: 'px' },
  { value: 'pt', text: 'pt' },
  { value: 'em', text: 'em' },
  { value: 'vw', text: 'vw' },
  { value: 'vh', text: 'vh' },
]

const refInput = ref()

const unitPickerValue = computed({
  get() {
    if (innerValue.value.units !== null) {
      return innerValue.value.units
    }

    return innerValue.value.value || null
  },

  set(newValue) {
    if (newValue == 'auto') {
      innerValue.value.value = 'auto'
      innerValue.value.units = null
    } else if (newValue === null) {
      innerValue.value.value = null
      innerValue.value.units = null
    } else {
      innerValue.value.units = newValue
      innerValue.value.value = parseFloat(innerValue.value.value) || 0
    }

    nextTick(() => refInput.value && refInput.value.select())
    emitUpdate()
  },
})

const pickerFace = computed(() => {
  return innerValue.value.units === null
    ? innerValue.value.value || 'default'
    : innerValue.value.units
})

const showInputField = computed(() => innerValue.value.units !== null)

function onFieldInput() {
  if (isNaN(parseFloat(innerValue.value.value))) {
    return
  }

  emitUpdate()
}
</script>

<template>
  <UiInput class="CssTypeLength">
    <div
      class="CssTypeLength__face UiInput__element"
      :title="$attrs.title"
    >
      <input
        v-if="showInputField"
        ref="refInput"
        v-model="innerValue.value"
        type="number"
        step="any"
        @input="onFieldInput"
      >
      <UiPopover>
        <template #trigger="{ open }">
          <span
            tabindex="0"
            @keydown.enter.prevent="open"
            v-text="pickerFace"
          />
        </template>
        <template #contents="{ close }">
          <UiInput
            v-model="unitPickerValue"
            type="select-list"
            :options="unitOptions"
            @update:model-value="close()"
          />
        </template>
      </UiPopover>
    </div>
  </UiInput>
</template>

<style lang="scss">
.CssTypeLength {
  &__face {
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: stretch;

    border-radius: 4px;
    background-color: field;
    color: fieldtext;

    padding: 3px;

    input {
      border: 0;
      font-size: 8pt;
      background: transparent;
      color: inherit;
      padding: 4px;
      flex: 1;
    }
  }

  .UiPopover__trigger {
    border-radius: 4px;
    padding: 2px 8px;
    display: flex;
    height: 100%;
    align-items: center;

    cursor: pointer;
    background-color: var(--ui-color-hover);
  }
}
</style>