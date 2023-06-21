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
  de: {
    'BlockVisibilityEditor.visibleWhen': 'Diesen Block anzeigen, wenn',
    'BlockVisibilityEditor.useAnimation': 'Animation verwenden',
  },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <UiItem
      class="BlockVisibilityEditor__item"
      :icon="block['v-if'] ? 'mdi:eye' : 'mdi:eye-outline'"
      text="Visibility"
      :subtext="i18n.t('BlockVisibilityEditor.visibleWhen')"
    />
    <VmStatement
      v-model="block['v-if']"
      class="BlockVisibilityEditor__stmt UiCodeContainer"
      :default="{ and: [] }"
      @update:model-value="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.BlockVisibilityEditor {
  // height: 100%;
  display: flex;
  flex-direction: column;

  &__item {
    user-select: none;
    --ui-item-padding: 12px;
    border-bottom: 1px solid var(--ui-color-ridge-top);
  }

  &__stmt {
    flex: 1;
  }
}

.BlockWindow__contents--BlockVisibilityEditor {
  padding: 0;
}

</style>