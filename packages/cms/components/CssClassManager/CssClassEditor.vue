<script setup>
/*
Modifies a CSSCLASS object:
{
  name: 'myClass',
  css: `
    .myClass {
      border: 1px solid red;
    }
  `,
}
*/
import { ref, watchEffect } from 'vue'
import { UiInput } from '../../../ui'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'rename'])

const innerValue = ref()
watchEffect(() => innerValue.value = { ...props.modelValue })

function emitUpdate() {
  // use first .XXXXX declaration to detemrine name
  const foundName = innerValue.value.css.match(/\.([a-zA-Z0-9_-]+)/)?.[1]
  if (foundName) {
    innerValue.value.name = foundName
  } else {
    innerValue.value.name = 'Untitled Class'
  }

  emit('update:modelValue', { ...innerValue.value })
}
</script>

<template>
  <UiInput
    v-model="innerValue.css"
    class="CssClassEditor"
    type="code"
    lang="css"
    @update:model-value="emitUpdate"
  />
</template>