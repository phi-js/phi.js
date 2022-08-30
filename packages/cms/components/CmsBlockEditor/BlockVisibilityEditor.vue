<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { VmStatement } from '@/packages/vm'
import { UiInput, UiDetails } from '@/packages/ui'

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
  en: { 'BlockVisibilityEditor.visibleWhen': 'Show block if...' },
  es: { 'BlockVisibilityEditor.visibleWhen': 'Mostrar bloque si...' },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <fieldset>
      <legend v-text="i18n.t('BlockVisibilityEditor.visibleWhen')" />
      <VmStatement
        v-model="block['v-if']"
        :default="{ and: [] }"
        @update:model-value="emitUpdate"
      />
    </fieldset>

    <UiInput
      v-model="block.transition"
      type="checkbox"
      label="Usar animación"
      @update:model-value="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.BlockVisibilityEditor {
  padding: 8px;

  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
    margin-bottom: 1rem;

    legend {
      font-size: 0.9em;
      font-weight: bold;
    }
  }
}
</style>