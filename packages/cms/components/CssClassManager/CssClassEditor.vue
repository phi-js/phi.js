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
  emit('update:modelValue', { ...innerValue.value })
}

const oldName = ref(props.modelValue?.name)
function onNameChanged(newName) {
  // Update class name in css
  innerValue.value.css = innerValue.value.css.replaceAll(`.${oldName.value} `, `.${newName} `)

  emitUpdate()
  emit('rename', { newName, oldName: oldName.value })
  oldName.value = newName
}
</script>

<template>
  <div class="CssClassEditor">
    <UiInput
      v-model="innerValue.name"
      @update:model-value="onNameChanged"
    />
    <UiInput
      v-model="innerValue.css"
      type="code"
      lang="css"
      @update:model-value="emitUpdate"
    />
  </div>
</template>