<script setup>
import { watch } from 'vue'
import { EditorContent } from '@tiptap/vue-3'

const props = defineProps({
  value: {
    type: String,
    required: false,
    default: '',
  },

  editor: {
    type: Object,
    required: true,
  },
})

watch(
  () => props.value,
  (incomingValue) => {
    if (props.editor.getHTML() != incomingValue) {
      props.editor.commands.setContent(incomingValue, false)
    }
  },
  { immediate: true },
)
</script>

<template>
  <EditorContent
    class="tiptap-editor-contents story-html"
    :editor="props.editor"
  />
</template>