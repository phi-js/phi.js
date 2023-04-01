<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { VmStatement } from '@/packages/vm'

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const block = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    block.value = newValue
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}

const i18n = useI18n({
  en: {
    'BlockVisibilityEditor.visibleWhen': 'This block is shown if',
    'BlockVisibilityEditor.useAnimation': 'Use animation',
  },
  es: {
    'BlockVisibilityEditor.visibleWhen': 'Mostrar este bloque si se cumplen',
    'BlockVisibilityEditor.useAnimation': 'Usar animación',
  },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <label>{{ i18n.t('BlockVisibilityEditor.visibleWhen') }}</label>
    <VmStatement
      v-model="block['v-if']"
      :default="{ and: [] }"
      @update:model-value="emitUpdate"
    />
  </div>
</template>