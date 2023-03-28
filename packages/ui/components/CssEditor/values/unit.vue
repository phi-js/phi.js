<script setup>
import { UiInput, UiPopover } from '@/packages/ui'
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

const refInput = ref()

const unitOptions = [
  { value: null, text: 'default' },
  ...units.map((u) => ({ text: u, value: u })),
]

function onUnitsChange() {
  emitUpdate()
  nextTick(() => refInput.value && refInput.value.select())
}

</script>

<template>
  <UiInput class="CssUnit">
    <div class="CssUnit__face">
      <input
        v-if="innerValue.units !== 'auto' && innerValue.units !== null"
        ref="refInput"
        v-model="innerValue.value"
        type="text"
        @input="emitUpdate"
      >

      <UiPopover>
        <template #trigger="{ open }">
          <span
            tabindex="0"
            @keydown.enter.prevent="open"
          >{{ innerValue.units || 'default' }}</span>
        </template>
        <template #contents="{ close }">
          <UiInput
            v-model="innerValue.units"
            type="select-list"
            :options="unitOptions"
            @update:model-value="onUnitsChange(); close()"
          />
        </template>
      </UiPopover>
    </div>
  </UiInput>
</template>

<style lang="scss">
.CssUnit {
  &__face {
    display: flex;
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
    padding: 2px 4px;
    display: block;

    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>