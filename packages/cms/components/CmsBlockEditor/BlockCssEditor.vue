<script setup>
/*
Editor for the block's "css" property

block
  css: {
    class: '' STRING.  A main class name to assign to this object
    classes: [] ARRAY.  An ARRAY of STRINGS of class names to assign to this object
    style: {} OBJECT. An object describing css attributes, passed to final component as :style="..."
    css: STRING.  A string with custom css classes, to be added as a <style> by CmsBlock.vue
  }
*/
import { reactive, watch } from 'vue'
import { UiTabs, UiTab } from '../../../ui/components'
import BlockCssClasses from './BlockCssClasses.vue'
import BlockCssStyle from './BlockCssStyle.vue'

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
  class: '',
  classes: [],
  style: {},
  css: '',
})

watch(
  () => props.modelValue,
  (incomingBlock) => {
    css.class = incomingBlock?.css?.class || ''
    css.classes = incomingBlock?.css?.classes?.length ? incomingBlock.css.classes : []
    css.style = incomingBlock?.css?.style || {}
    css.css = incomingBlock?.css?.css || ''
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify({ ...props.modelValue, css }))) // cloning prevents recursive updates
}

</script>

<template>
  <UiTabs
    class="BlockCssEditor"
    name="BlockCssEditor"
  >
    <UiTab text="Classes">
      <BlockCssClasses
        v-model="css.classes"
        @update:model-value="emitUpdate"
      />
    </UiTab>

    <UiTab text="Properties">
      <BlockCssStyle
        v-model="css.style"
        @update:model-value="emitUpdate"
      />
    </UiTab>
  </UiTabs>
</template>