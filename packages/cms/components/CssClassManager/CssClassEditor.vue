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

  icon,
  text,
  subtext,
  description,
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
const emit = defineEmits(['update:modelValue'])

const innerValue = ref()
watchEffect(() => innerValue.value = { ...props.modelValue })

function emitUpdate() {
  emit('update:modelValue', { ...innerValue.value })
}
</script>

<template>
  <div class="CssClassEditor">
    <UiInput
      v-model="innerValue.text"
      label="Title"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="innerValue.name"
      label="Class name"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="innerValue.css"
      label="CSS"
      type="code"
      lang="css"
      @update:model-value="emitUpdate"
    />
  </div>
</template>