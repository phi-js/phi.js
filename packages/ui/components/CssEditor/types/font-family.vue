<script setup>
import { inject, computed } from 'vue'

import UiInput from '../../UiInput/UiInput.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

/*
_ui_CssEditor_availableFonts
injected list of available FONT objects:
[
  {
    id: 'unique ID',
    url: 'http....' // URL to be used via @import url('...,
    name: 'Font Name here'
    fontFamily: 'Font name here' // to be used as font-family: value
    type: 'google-font' // ... only google-font is used for now
  }
]
*/
const availableFonts = inject('_ui_CssEditor_availableFonts', null)
const createFont = inject('_ui_CssEditor_createFont', null)

const fontOptions = computed(() => {
  const options = [
    {
      value: null,
      text: 'Default',
    },
  ]

  if (availableFonts?.value) {
    options.push(...availableFonts.value.map((font) => ({
      value: font.fontFamily,
      text: font.name,
    })))
  }

  if (typeof createFont === 'function') {
    options.push({
      value: '--create--',
      text: '... Add font',
    })
  }

  return options
})

async function onSelectFont(newValue) {
  let targetValue = ''

  if (newValue === '--create--') {
    const customFont = await createFont()
    if (customFont) {
      targetValue = customFont
    }
  } else {
    targetValue = newValue
  }

  // // !!! Set --ui-font-titles & --ui-font-texts CSS variables (used by main PHI style)
  // css.value['--ui-font-titles'] = css.value['font-family']
  // css.value['--ui-font-texts'] = css.value['font-family']
  emit('update:modelValue', targetValue)
}
</script>

<template>
  <div class="CssValueFontFamily">
    <UiInput
      v-if="fontOptions.length"
      :model-value="props.modelValue"
      type="select-native"
      :options="fontOptions"
      @update:model-value="onSelectFont"
    />
  </div>
</template>