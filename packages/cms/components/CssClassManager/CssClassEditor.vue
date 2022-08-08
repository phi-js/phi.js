<script setup>
/*
Modifies a type=class stylesheet object:
{
  id: 'highlihgtedTexts',
  src: '.highlihgtedTexts {\n}\n\n.highlihgtedTexts h2 {\n  color: var(--ui-color-primary);\n  font-weight: 600;\n  font-size: 3em;\n}',
  type: 'class',
},
*/
import { ref, watch } from 'vue'
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
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = { ...newValue },
  { immediate: true },
)

function emitUpdate() {
  // use first .XXXXX declaration to detemrine name
  const foundName = innerValue.value.src.match(/\.([a-zA-Z0-9_-]+)/)?.[1]
  if (foundName) {
    innerValue.value.id = foundName
  } else {
    innerValue.value.id = 'Untitled Class'
  }

  emit('update:modelValue', { ...innerValue.value })
}
</script>

<template>
  <UiInput
    v-model="innerValue.src"
    class="CssClassEditor"
    type="code"
    lang="css"
    @update:model-value="emitUpdate"
  />
</template>