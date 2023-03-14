<script setup>
import { ref, watch } from 'vue'

import UiInput from '../../UiInput/UiInput.vue'
import CssColor from '../values/color.vue'
import CssUnit from '../values/unit.vue'

const props = defineProps({
  /*
  CSS Object:
  {
    fontSize: '12pt',
    fontFamily: 'MyFontWhatever, sans-serif',
    color: "#fff",
    textShadow: "1px 1px 1px #000",
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
</script>

<template>
  <div class="CssTypography">
    <CssColor
      v-model="css.color"
      label="Color"
      @update:model-value="emitUpdate"
    />

    <CssUnit
      v-model="css.fontSize"
      label="Font size"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-model="css.textShadow"
      type="textarea"
      label="Text shadow"
      @update:model-value="emitUpdate"
    />
  </div>
</template>