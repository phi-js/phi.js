<script setup>
import { shallowRef, watch, inject } from 'vue'
import { getBlockEditors } from '../../functions'
import BlockEditorLayout from './BlockEditorLayout.vue'
import EditorAction from './EditorAction.vue'
import { UiInput } from '/packages/ui/components'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block', 'delete'])

const $settings = inject('$_cms_settings')

const editors = shallowRef({})
watch(
  () => props.block?.component,
  async () => editors.value = await getBlockEditors(props.block, $settings),
  { immediate: true },
)
</script>

<template>
  <BlockEditorLayout
    class="BlockScaffold"
    :block="props.block"
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