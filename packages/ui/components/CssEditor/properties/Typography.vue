<script setup>
import { ref, watch, inject, computed } from 'vue'

import UiInput from '../../UiInput/UiInput.vue'
import CssColor from '../values/color.vue'
import CssUnit from '../values/unit.vue'

const props = defineProps({
  /*
  CSS Object (already sanitized.  i.e. property names are dashed-case):
  {
    "font-family": 'MyFontWhatever, sans-serif',
    "color": "#fff",
    "text-shadow": "1px 1px 1px #000",
    ...
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const css = ref()

watch(
  () => props.modelValue,
  () => css.value = { ...props.modelValue },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...css.value })
}

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
  if (newValue === '--create--') {
    const customFont = await createFont()
    if (customFont) {
      css.value['font-family'] = customFont
    }
  } else {
    css.value['font-family'] = newValue
  }

  // !!! Set --ui-font-titles & --ui-font-texts CSS variables (used by main PHI style)
  css.value['--ui-font-titles'] = css.value['font-family']
  css.value['--ui-font-texts'] = css.value['font-family']

  emitUpdate()
}
</script>

<template>
  <div class="CssTypography">
    <UiInput
      v-if="fontOptions.length"
      :model-value="css['font-family']"
      type="select-native"
      :options="fontOptions"
      label="Font family"
      @update:model-value="onSelectFont"
    />
    <UiInput
      v-else
      v-model="css['font-family']"
      type="text"
      label="Font family"
      @update:model-value="emitUpdate"
    />
    <CssUnit
      v-model="css['font-size']"
      label="Font size"
      @update:model-value="emitUpdate"
    />
    <CssColor
      v-model="css['color']"
      label="Color"
      @update:model-value="emitUpdate"
    />
    <!-- <UiInput
      v-model="css['textShadow']"
      type="textarea"
      label="Text shadow"
      @update:model-value="emitUpdate"
    /> -->
  </div>
</template>