<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
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
    'BlockRepeatEditor.Repeat': 'Repeat...',
    'BlockRepeatEditor.RepeatForEveryItemIn': 'Repeat block for every $item in',
    'BlockRepeatEditor.VariableName': 'Variable name',
    'BlockRepeatEditor.subtext': 'The variable must contain an array',
  },
  es: {
    'BlockRepeatEditor.Repeat': 'Repetir...',
    'BlockRepeatEditor.RepeatForEveryItemIn': 'Repetir bloque por cada $item en',
    'BlockRepeatEditor.VariableName': 'Nombre de variable',
    'BlockRepeatEditor.subtext': 'La variable debe contener un arreglo',
  },
})
</script>

<template>
  <div class="BlockRepeatEditor">
    <UiInput
      v-model="block['v-for']"
      type="text"
      model="v-for"
      :label="i18n.t('BlockRepeatEditor.RepeatForEveryItemIn')"
      :placeholder="i18n.t('BlockRepeatEditor.VariableName')"
      :subtext="i18n.t('BlockRepeatEditor.subtext')"
      @update:model-value="emitUpdate"
    />
  </div>
</template>