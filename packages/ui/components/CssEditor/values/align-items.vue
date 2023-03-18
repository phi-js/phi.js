<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'CssAlignItems.scroll': 'Scroll with page',
    'CssAlignItems.fixed': 'Remain fixed',
    'CssAlignItems.local': 'Scroll with element',
  },
  es: {
    'CssAlignItems.scroll': 'Desplazar con la página',
    'CssAlignItems.fixed': 'Permanecer fijo',
    'CssAlignItems.local': 'Desplazar con elemento',
  },
})

const props = defineProps({
  /*
  String. A background-attachment value
  e.g:. "scroll", "fixed", "local"
  */
  modelValue: {
    type: String,
    required: false,
    default: 'scroll',
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref('')
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = newValue,
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', innerValue.value)
}
</script>

<template>
  <UiInput
    v-model="innerValue"
    type="select-native"
    class="CssAlignItems"
    :options="[
      { value: 'flex-start', icon: 'mdi:align-vertical-top', text: 'flex-start' },
      { value: 'center', icon: 'mdi:align-vertical-center', text: 'center' },
      { value: 'flex-end', icon: 'mdi:align-vertical-bottom', text: 'flex-end' },
    ]"
    @update:model-value="emitUpdate"
  />
</template>