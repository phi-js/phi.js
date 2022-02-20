<script setup>
/*
Editor for the block's "css" property

block
{
  css: {
    classes: ['className1', 'className2', ...],  // array of class names

    variables: { // object with CSS variables/properties
      '--ui-content-width': '60px',
      '--ui-radius': '5px',
      '--ui-breathe': '12px',
      '--ui-color-primary': '#aabbcc00'
      ...
    },

    style: ' string '  // string with inline styles
  }
}
*/
import { reactive, watch } from 'vue'
import { UiInput, UiTabs, UiTab } from '../../../ui/components'
import BlockCssClasses from './BlockCssClasses.vue'
import BlockCssVariables from './BlockCssVariables.vue'

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const css = reactive({
  classes: [],
  variables: {},
  style: '',
})

watch(
  () => props.modelValue,
  (incomingBlock) => {
    css.classes = Array.isArray(incomingBlock?.css?.classes) ? incomingBlock.css.classes : []
    css.variables = incomingBlock?.css?.variables && typeof incomingBlock.css.variables === 'object'
      ? incomingBlock.css.variables : {}
    css.style = typeof incomingBlock?.css?.style === 'string' ? incomingBlock.css.style : ''
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...props.modelValue, css })
}
</script>

<template>
  <UiTabs class="BlockCssEditor">
    <UiTab text="Classes">
      <BlockCssClasses v-model="css.classes" @update:model-value="emitUpdate" />
    </UiTab>

    <UiTab text="Variables">
      <BlockCssVariables v-model="css.variables" @update:model-value="emitUpdate" />
    </UiTab>

    <UiTab text="CSS">
      <UiInput v-model="css.style" type="code" lang="css" @update:model-value="emitUpdate" />
    </UiTab>
  </UiTabs>
</template>