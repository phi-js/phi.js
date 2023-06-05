<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'

const i18n = useI18n({
  en: { 'UiInputVariable.RuleDescription': 'Use only alphanumeric characters' },
  es: { 'UiInputVariable.RuleDescription': 'Usa únicamente caracteres alfanuméricos' },
  de: { 'UiInputVariable.RuleDescription': 'Verwenden Sie nur alphanumerische Zeichen' },
  pt: { 'UiInputVariable.RuleDescription': 'Utilize apenas caracteres alfanuméricos' },
})

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerValue = ref()
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = newValue || '',
  { immediate: true },
)
</script>

<template>
  <input
    v-model="innerValue"
    class="UiInputVariable UiInput__element"
    type="text"
    pattern="[a-zA-Z_$][a-zA-Z0-9_$.]*"
    :title="i18n.t('UiInputVariable.RuleDescription')"
    @input="emit('update:modelValue', innerValue)"
  >
</template>