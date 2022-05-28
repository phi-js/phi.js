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
    'BlockVisibilityEditor.visibleWhen': 'Show block if ...',
    'BlockVisibilityEditor.Repeat': 'Repeat',
    'BlockVisibilityEditor.RepeatForEveryItemIn': 'Repeat block for every $item in',
    'BlockVisibilityEditor.VariableName': 'Variable name',
    'BlockVisibilityEditor.subtext': 'The variable must contain an array',
  },
  es: {
    'BlockVisibilityEditor.visibleWhen': 'Mostrar bloque si ...',
    'BlockVisibilityEditor.Repeat': 'Repetir',
    'BlockVisibilityEditor.RepeatForEveryItemIn': 'Repetir bloque por cada $item en',
    'BlockVisibilityEditor.VariableName': 'Nombre de variable',
    'BlockVisibilityEditor.subtext': 'La variable debe contener un arreglo',
  },
})
</script>

<template>
  <div class="BlockVisibilityEditor">
    <details open>
      <summary v-text="i18n.t('BlockVisibilityEditor.visibleWhen')" />
      <section>
        <VmStatement
          v-model="block['v-if']"
          :default="{ and: [] }"
          @update:model-value="emitUpdate"
        />
        <!-- <UiInput
          v-model="block.transition"
          type="checkbox"
          label="Usar animación"
          @update:model-value="emitUpdate"
        /> -->
      </section>
    </details>



    <details>
      <summary v-text="i18n.t('BlockVisibilityEditor.Repeat')" />
      <section>
        <UiInput
          v-model="block['v-for']"
          type="text"
          model="v-for"
          :label="i18n.t('BlockVisibilityEditor.RepeatForEveryItemIn')"
          :placeholder="i18n.t('BlockVisibilityEditor.VariableName')"
          :subtext="i18n.t('BlockVisibilityEditor.subtext')"
          @update:model-value="emitUpdate"
        />
      </section>
    </details>
  </div>
</template>