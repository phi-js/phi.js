<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItem } from '@/packages/ui'
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
    'BlockVisibilityEditor.visibleWhen': 'Show this block if',
    'BlockVisibilityEditor.useAnimation': 'Use animation',
  },
  es: {
    'BlockVisibilityEditor.visibleWhen': 'Mostrar este bloque si',
    'BlockVisibilityEditor.useAnimation': 'Usar animación',
  },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <UiItem
      class="BlockVisibilityEditor__item"
      :icon="block['v-if'] ? 'mdi:eye' : 'mdi:eye-outline'"
      :text="i18n.t('BlockVisibilityEditor.visibleWhen')"
    />
    <VmStatement
      v-model="block['v-if']"
      class="BlockVisibilityEditor__stmt"
      :default="{ and: [] }"
      @update:model-value="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.BlockVisibilityEditor {
  &__item {
    --ui-item-padding: 6px 12px;
    margin-bottom: 6px;
  }

  &__stmt {
    border: 1px solid #eee;
  }
}
</style>