<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { VmStatement } from '@/packages/vm'
import { UiInput } from '@/packages/ui'

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
    'BlockVisibilityEditor.visibleWhen': 'Show block if...',
    'BlockVisibilityEditor.useAnimation': 'Use animation',
  },
  es: {
    'BlockVisibilityEditor.visibleWhen': 'Mostrar bloque si...',
    'BlockVisibilityEditor.useAnimation': 'Usar animación',
  },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <VmStatement
      v-model="block['v-if']"
      :default="{ and: [] }"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="block.transition"
      type="checkbox"
      :placeholder="i18n.t('BlockVisibilityEditor.useAnimation')"
      @update:model-value="emitUpdate"
    />
  </div>
</template>