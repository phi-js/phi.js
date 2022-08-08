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
  en: {
    'BlockVisibilityEditor.visibleWhen': 'Show block if...',
    'BlockVisibilityEditor.Repeat': 'Repeat...',
    'BlockVisibilityEditor.RepeatForEveryItemIn': 'Repeat block for every $item in',
    'BlockVisibilityEditor.VariableName': 'Variable name',
    'BlockVisibilityEditor.subtext': 'The variable must contain an array',
  },
  es: {
    'BlockVisibilityEditor.visibleWhen': 'Mostrar bloque si...',
    'BlockVisibilityEditor.Repeat': 'Repetir...',
    'BlockVisibilityEditor.RepeatForEveryItemIn': 'Repetir bloque por cada $item en',
    'BlockVisibilityEditor.VariableName': 'Nombre de variable',
    'BlockVisibilityEditor.subtext': 'La variable debe contener un arreglo',
  },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <UiDetails
      open
      :text="i18n.t('BlockVisibilityEditor.visibleWhen')"
      group="BlockVisibilityEditor"
    >
      <VmStatement
        v-model="block['v-if']"
        :default="{ and: [] }"
        @update:model-value="emitUpdate"
      />
    </UiDetails>


    <!-- <fieldset
      open
      :text="i18n.t('BlockVisibilityEditor.visibleWhen')"
      group="BlockVisibilityEditor"
    >
      <UiInput
        v-model="block.transition"
        type="checkbox"
        label="Usar animación"
        @update:model-value="emitUpdate"
      />
    </fieldset> -->

    <UiDetails
      :text="i18n.t('BlockVisibilityEditor.Repeat')"
      group="BlockVisibilityEditor"
    >
      <UiInput
        v-model="block['v-for']"
        type="text"
        model="v-for"
        :label="i18n.t('BlockVisibilityEditor.RepeatForEveryItemIn')"
        :placeholder="i18n.t('BlockVisibilityEditor.VariableName')"
        :subtext="i18n.t('BlockVisibilityEditor.subtext')"
        @update:model-value="emitUpdate"
      />
    </UiDetails>
  </div>
</template>

<style lang="scss">
.BlockVisibilityEditor {
  .UiDetails {
    margin-bottom: 1rem;
    summary {
      font-size: 14px;
    }
  }
}
</style>