<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import CmsPropInput from '../../../../components/CmsPropInput/CmsPropInput.vue'

const props = defineProps({
  // BLOCK object
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

// internal "block" object (clone of props.modelValue)
const block = ref()
watch(
  () => props.modelValue,
  (newValue) => {
    block.value = JSON.parse(JSON.stringify(newValue))
    block.value.props = Object.assign({
      adderLabel: '',
      min: 0,
      max: 999,
    }, block.value.props)
  },
  { immediate: true },
)

const emitUpdate = function () {
  emit('update:modelValue', block.value)
}

const i18n = useI18n({
  en: {
    'InputListSettings.label': 'Title',
    'InputListSettings.adderLabel': 'Label (add item)',
    'InputListSettings.deleteLabel': 'Warning message (delete)',
  },
  es: {
    'InputListSettings.label': 'Título',
    'InputListSettings.adderLabel': 'Etiqueta (agregar elemento)',
    'InputListSettings.deleteLabel': 'Mensaje de advertencia (eliminar)',
  },
})
</script>

<template>
  <div class="InputListSettings UiForm">
    <UiInput
      v-model="block.title"
      class="InputListSettings__input"
      type="text"
      :label="i18n.t('InputListSettings.label')"
      @update:model-value="emitUpdate"
    />

    <CmsPropInput
      v-model="block.props.adderLabel"
      type="text"
      :label="i18n.t('InputListSettings.adderLabel')"
      @update:model-value="emitUpdate"
    />

    <CmsPropInput
      v-model="block.props.deleteLabel"
      type="text"
      :label="i18n.t('InputListSettings.deleteLabel')"
      @update:model-value="emitUpdate"
    />
  </div>
</template>

<style lang="scss">
.InputListSettings {
  &__navigator {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .UiInput--type-checkbox .UiInput__body label {
      padding-right: 12px;
    }
  }
}
</style>