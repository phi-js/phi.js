<script setup>
/*
Editor for the block's "css" property

block
  css: {
    class: '' STRING.  A main class name to assign to this object
    classes: [] ARRAY.  An ARRAY of STRINGS of class names to assign to this object
    style: {} OBJECT. An object describing css attributes, passed to final component as :style="..."
    css: STRING.  A string with custom css classes, to be added as a stylestheet via applyStoryCss
  }
*/
import { reactive, watch } from 'vue'
import { UiInput, UiTabs, UiTab } from '../../../ui/components'
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
  css: ''
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
  emit('update:modelValue', { ...props.modelValue, css })
}
</script>

<template>
  <UiTabs class="BlockCssEditor" name="BlockCssEditor">
    <UiTab text="Classes">
      <BlockCssClasses v-model="css.classes" @update:model-value="emitUpdate" />
    </UiTab>

    <UiTab text="Properties">
      <BlockCssStyle v-model="css.style" @update:model-value="emitUpdate" />
    </UiTab>

    <UiTab text="CSS">
      <div class="UiForm">
        <UiInput v-model="css.class" placeholder="Class" @update:model-value="emitUpdate" />
        <UiInput
          v-model="css.css"
          type="code"
          lang="css"
          @update:model-value="emitUpdate"
          style="padding: 0"
        />
      </div>
    </UiTab>
  </UiTabs>
</template>