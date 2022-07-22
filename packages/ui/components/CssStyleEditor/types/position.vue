<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import { parsePositionString, positionToString } from '../helpers.js'

const i18n = useI18n({
  en: {
    'CssPosition.Horizontal': 'Horizontal',
    'CssPosition.Vertical': 'Vertical',
  },
})

const props = defineProps({
  /*
  String. A background-position value
  e.g:.
  "left top"
  "right center"
  "3px 50%"
  "initial"
  */
  modelValue: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref()
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = parsePositionString(newValue),
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', positionToString(innerValue.value))
}
</script>

<template>
  <div class="CssPosition">
    <UiInput
      v-model="innerValue.x.value"
      :label="i18n.t('CssPosition.Horizontal')"
      type="select-buttons"
      :options="[
        { value: 'left', icon: 'mdi:align-horizontal-left' },
        { value: 'center', icon: 'mdi:align-horizontal-center' },
        { value: 'right', icon: 'mdi:align-horizontal-right' },
      ]"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="innerValue.y.value"
      :label="i18n.t('CssPosition.Vertical')"
      type="select-buttons"
      :options="[
        { value: 'top', icon: 'mdi:align-vertical-top' },
        { value: 'center', icon: 'mdi:align-vertical-center' },
        { value: 'bottom', icon: 'mdi:align-vertical-bottom' },
      ]"
      @update:model-value="emitUpdate"
    />
  </div>
</template>