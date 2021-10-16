<script setup>
import { shallowRef, ref, watch, defineAsyncComponent } from 'vue'
import { getBlockEditors, getBlockDefinition } from '../../composables'
import { UiInput } from '/packages/ui/components'
import BlockEditorLayout from './BlockEditorLayout.vue'
import EditorAction from './EditorAction.vue'

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
   *   "v-for": ...,
   * }
   */
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block', 'delete'])

const editors = shallowRef(null)
const blockDefinition = shallowRef(null)
const customEditor = shallowRef(null)

watch(
  () => props.block?.component,
  async () => {
    editors.value = await getBlockEditors(props.block)

    let definition = await getBlockDefinition(props.block)
    if (!definition) {
      console.warn('Could not find definition for block', props.block)
      return
    }
    blockDefinition.value = { name: props.block.component, ...definition }

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

const isFocused = ref(false)

</script>

<template>
  <template v-if="blockDefinition">
    <component
      :is="customEditor"
      v-if="customEditor"
      class="CmsBlockEditor"
      :block="props.block"
      @update:block="emit('update:block', $event)"
      @delete="emit('delete')"
    />
    <BlockEditorLayout
      v-else
      class="CmsBlockEditor"
      :block="props.block"
      :focused="isFocused"
      @update:block="emit('update:block', $event)"
      @delete="emit('delete')"
    >
      <template
        v-if="editors.toolbar"
        #toolbar
      >
        <EditorAction
          :action="editors.toolbar"
          :block="props.block"
          @update:block="emit('update:block', $event)"
        />
      </template>

      <template #default="{ blockValue }">
        <EditorAction
          v-if="editors.face"
          :action="editors.face"
          :block="blockValue"
          v-bind="blockValue?.props"
          tabindex="0"
          @update:block="emit('update:block', $event)"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <UiInput
          v-else
          type="json"
          :model-value="blockValue"
          @update:modelValue="emit('update:block', $event)"
        />
      </template>
    </BlockEditorLayout>
  </template>
</template>