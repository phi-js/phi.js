<script setup>
import { useI18n } from '@/packages/i18n'
import CssInput from '@/packages/ui/components/CssEditor/CssInput.vue'

const i18n = useI18n({
  en: {
    'StoryColorPalette.Background': 'Background',
    'StoryColorPalette.Foreground': 'Foreground',
    'StoryColorPalette.Primary': 'Primary',
  },
  es: {
    'StoryColorPalette.Background': 'Fondo',
    'StoryColorPalette.Foreground': 'Textos',
    'StoryColorPalette.Primary': 'Primario',
  },
})

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  /*
  {
    '--ui-color-background': '...',
    '--ui-color-foreground': '...',
    '--ui-color-primary': '...',
  }
  */
  defaultValues: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

function setCssVariable(variableName, variableValue) {
  emit('update:modelValue', {
    ...props.modelValue,
    [variableName]: variableValue,
  })
}
</script>

<template>
  <div class="StoryColorPalette UiForm UiForm--wide">
    <CssInput
      type="color"
      :label="i18n.t('StoryColorPalette.Background')"
      :model-value="modelValue['--ui-color-background'] || defaultValues['--ui-color-background']"
      @update:model-value="setCssVariable('--ui-color-background', $event)"
    />
    <CssInput
      type="color"
      :label="i18n.t('StoryColorPalette.Foreground')"
      :model-value="modelValue['--ui-color-foreground'] || defaultValues['--ui-color-foreground']"
      @update:model-value="setCssVariable('--ui-color-foreground', $event)"
    />
    <CssInput
      type="color"
      :label="i18n.t('StoryColorPalette.Primary')"
      :model-value="modelValue['--ui-color-primary'] || defaultValues['--ui-color-primary']"
      @update:model-value="setCssVariable('--ui-color-primary', $event)"
    />
  </div>
</template>