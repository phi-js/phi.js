<script setup>
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui/components'

const i18n = useI18n({
  en: {
    'BoolPicker.isTrue': 'Checked',
    'BoolPicker.isFalse': 'Not checked',
  },
  es: {
    'BoolPicker.isTrue': 'Verdadero',
    'BoolPicker.isFalse': 'Falso',
  },
})

</script>

<template>
  <UiInput
    class="BoolPicker"
    type="select-list"
    :options="[
      { value: 1, text: i18n.t('BoolPicker.isTrue') },
      { value: 0, text: i18n.t('BoolPicker.isFalse') },
    ]"
  />
</template>