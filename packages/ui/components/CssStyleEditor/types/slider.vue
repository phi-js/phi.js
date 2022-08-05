<script setup>
import { ref, watch, computed, useAttrs } from 'vue'
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

  defaultValue: {
    type: [String, Number],
    required: false,
    default: 0,
  },
})
const emit = defineEmits(['update:modelValue'])
const attrs = useAttrs()

const innerValue = ref({
  value: null,
  units: null,
})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = parseUnitString(newValue)
    if (!innerValue.value.units) {
      innerValue.value.value = props.defaultValue
      innerValue.value.units = 'px'
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', unitToString(innerValue.value))
}

const rangeAttributes = computed(() => ({
  min: innerValue.value.units == '%' ? 20 : parseInt(attrs.min),
  max: innerValue.value.units == '%' ? 100 : parseInt(attrs.max),
}))
</script>

<template>
  <div
    class="CssSlider"
    :class="{'CssSlider--null': !innerValue.value || innerValue.value == props.defaultValue}"
  >
    <UiInput
      :model-value="innerValue.value"
      class="CssSlider__input"
      type="range"
      v-bind="rangeAttributes"
      @update:model-value="innerValue.value = $event; emitUpdate();"
    />
    <span>{{ innerValue.value || 'auto' }}</span>
    <select
      v-model="innerValue.units"
      class="CssSlider__select"
      @change="emitUpdate()"
    >
      <option value="px">
        px
      </option>
      <option value="%">
        %
      </option>
    </select>
  </div>
</template>

<style lang="scss">
.CssSlider {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__input {
    flex: 1;
    padding-right: 20px;

    input {
      width: 100%;
    }
  }

  &--null {
    opacity: 0.5;
  }

  & > span,
  &__select {
    background: transparent;
    color: inherit;
    font-weight: 600;
    border: 0;
    margin: 0;
    padding: 5px;

    font-size: 14px;
  }
}
</style>