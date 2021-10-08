<script setup>
import Cms from '../../singleton'
import { shallowRef, watch, defineAsyncComponent } from 'vue'
import { UiInput } from '/packages/ui/components'
import BlockEditorLayout from './BlockEditorLayout.vue'

const props = defineProps({
  /**
   * @model
   *
   * {
   *   "component": "x",
   *   "props": { ... },
   *   "v-model": ...,
   *   "v-if": ...,
   *   "v-on": ...,
   * }
   */
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block'])

const blockDefinition = shallowRef(null)
const editorFace = shallowRef(null)
const customEditor = shallowRef(null)

watch(
  () => props.block?.component,
  async () => {
    let definition = await Cms.getDefinition(props.block)
    if (!definition) {
      console.warn('Could not find definition for block', props.block)
      return
    }
    blockDefinition.value = { name: props.block.component, ...definition }

    if (definition?.editor?.face) {
      editorFace.value = definition.editor.face
      if (typeof editorFace.value.component === 'function') {
        editorFace.value.component = defineAsyncComponent(editorFace.value.component)
      }
    }

    if (definition?.editor?.custom) {
      if (typeof definition.editor.custom === 'function') {
        customEditor.value = defineAsyncComponent(definition.editor.custom)
      } else {
        customEditor.value = definition.editor.custom
      }
    }
  },
  { immediate: true },
)
</script>

<template>
  <!-- <pre>blockDefinition: {{ blockDefinition }}</pre> -->
  <component
    :is="customEditor"
    v-if="customEditor"
    class="CmsBlockEditor"
    :block="props.block"
    @update:block="emit('update:block', $event)"
  />
  <BlockEditorLayout
    v-else
    class="CmsBlockEditor"
  >
    <template #toolbarxxx>
      sdkjlfh asdlkjfh aslkdfjhasdkjl
    </template>

    <template #default>
      <component
        :is="editorFace.component"
        v-if="editorFace"
        :block="props.block"
        @update:block="emit('update:block', $event)"
      />
      <UiInput
        v-else
        type="json"
        :model-value="props.block"
        @update:modelValue="emit('update:block', $event)"
      />
    </template>
  </BlockEditorLayout>
</template>