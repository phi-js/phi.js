<script setup>
import { UiInput } from '@/packages/ui'
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  /*
  STRING. A css UNIT value
  e.g:.  "12px", "50%", "auto", "none"
  */
  modelValue: {
    type: [String, Number],
    required: false,
    default: '',
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

const units = [
  'auto',

  '%',
  'px',
  'pt',
  'em',
  'vw',
  'vh',
]

/*
Determines "value" and "units" for the given string

parseValue("12px") -> {value: 12, units: 'px'}
parseValue("50%") -> {value: 50, units: '%'}
parseValue("auto") -> {value: null, units: 'auto'}
parseValue("none") -> {value: null, units: 'none'}
*/
function parseUnits(str) {
  if (!str) {
    return {
      value: null,
      units: str,
    }
  }

  const parsedValue = parseFloat(str)
  const units = str.replace(parsedValue, '').trim() || null
  return {
    value: isNaN(parsedValue) ? null : parsedValue,
    units: units,
  }
}

function toUnitString(obj, defaultValue = 0) {
  if (typeof obj === 'string') {
    return obj
  }

  if (obj.units === 'auto') {
    return obj.units
  }

  if (obj.value === null) {
    return defaultValue
  }

  return `${obj.value}${obj.units || 'px'}`
}

const refForm = ref()
const isOpen = ref(false)

function openInput() {
  isOpen.value = true

  // focus+select first form input
  nextTick(() => refForm.value.querySelector('input,select')?.focus?.())
}

function onFormSubmit() {
  isOpen.value = false
}

</script>

<template>
  <UiInput
    class="CssUnit"
    :class="{'CssUnit--closed': !isOpen}"
  >
    <div class="CssUnit__container">
      <div
        class="CssUnit__face"
        tabindex="0"
        @click="openInput"
        @keydown.enter.prevent="openInput"
      >
        {{ props.modelValue || '-' }}
      </div>
      <form
        ref="refForm"
        class="CssUnit__form"
        @submit.prevent="onFormSubmit"
      >
        <input
          v-if="innerValue.units !== 'auto'"
          v-model="innerValue.value"
          type="number"
          @input="emitUpdate"
        >
        <select
          v-model="innerValue.units"
          @change="emitUpdate"
        >
          <option
            v-for="unit in units"
            :key="unit"
            :value="unit"
            v-text="unit"
          />
        </select>
        <input
          type="submit"
          value="OK"
        >
      </form>
    </div>
  </UiInput>
</template>

<style lang="scss">
.CssUnit {
  &__container {
    position: relative;
    padding: 3px;
  }

  &__form {
    background-color: #3f3f3f;
    color: #fff;
    padding: 8px;
    border-radius: 4px;

    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 5px;

    input[type=submit] {
      background: transparent;
      border: none;
      color: #fff;
      font-size: 8pt;
      font-weight: bold;
    }
  }

  &--closed &__form {
    display: none;
  }
}
</style>