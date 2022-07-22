<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'
import { parseUnitString, unitToString } from '../helpers'

const props = defineProps({
  /*
  String. A CSS unit
  e.g:. "100px", "100%", "50vw"
  */
  modelValue: {
    type: String,
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
  (newValue) => innerValue.value = parseUnitString(newValue),
  { immediate: true },
)

function emitUpdate() {
  // if (!innerValue.value.units && !isNaN(parseInt(innerValue.value.value))) {
  //   innerValue.value.units = 'px'
  // }

  emit('update:modelValue', unitToString(innerValue.value))
}
</script>

<template>
  <div class="CssUnit">
    <UiInput
      v-model="innerValue.value"
      class="CssUnit__input"
      :type="innerValue.units ? 'number' : 'text'"
      @update:model-value="emitUpdate()"
    />
    <select
      v-model="innerValue.units"
      class="CssUnit__select"
      @change="emitUpdate()"
    >
      <option value="px">
        px
      </option>
      <option value="%">
        %
      </option>
      <option value="pt">
        pt
      </option>
      <option value="vw">
        vw
      </option>
      <option value="vh">
        vh
      </option>
    </select>
  </div>
</template>

<style lang="scss">
.CssUnit {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  .UiInput__element {
    width: 6rem;
  }

  &__select {
    background: transparent;
    color: inherit;
    font-weight: 600;
    border: 0;
    margin: 0;
    padding: 5px;
  }
}
</style>