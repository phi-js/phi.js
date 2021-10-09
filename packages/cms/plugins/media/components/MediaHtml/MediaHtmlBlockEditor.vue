<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { UiIcon } from '/packages/ui/components'
import BlockEditorLayout from '../../../../components/CmsBlockEditor/BlockEditorLayout.vue'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:block', 'focus', 'blur'])

const innerValue = ref('')

const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  content: '',
  onFocus: () => emit('focus'),
  onBlur: () => emit('blur'),
  onUpdate: () => {
    innerValue.value = editor.getHTML()
    emit('update:block', { ...props.block, props: { ...props.block.props, value: innerValue.value } })
  },
})
onBeforeUnmount(() => editor.destroy())

watch(
  () => props.block,
  (newValue) => {
    let incomingValue = newValue?.props?.value || ''
    if (incomingValue != innerValue.value) {
      innerValue.value = incomingValue
      editor.commands.setContent(innerValue.value, false)
    }
  },
  { immediate: true },
)

const allCommands = computed(() => {
  return {
    p: {
      text: 'P',
      callback: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
    },
    h1: {
      text: 'H1',
      callback: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
    },
    h2: {
      text: 'H2',
      callback: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
    },
    h3: {
      text: 'H3',
      callback: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
    },
    bold: {
      text: 'B',
      callback: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
    },
    italic: {
      text: 'I',
      callback: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
    },
    underline: {
      text: 'U',
      callback: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive('underline'),
    },

    alignClear: {
      text: 'none',
      callback: () => editor.chain().focus().unsetTextAlign().run(),
      isActive: false,
    },

    alignLeft: {
      icon: 'mdi:format-align-left',
      text: 'lft',
      callback: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: editor.isActive({ textAlign: 'left' }),
    },

    alignCenter: {
      icon: 'mdi:format-align-center',
      text: 'ctr',
      callback: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: editor.isActive({ textAlign: 'center' }),
    },

    alignRight: {
      icon: 'mdi:format-align-right',
      text: 'right',
      callback: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: editor.isActive({ textAlign: 'right' }),
    },

    alignJustify: {
      icon: 'mdi:format-align-justify',
      text: 'justify',
      callback: () => editor.chain().focus().setTextAlign('justify').run(),
      isActive: editor.isActive({ textAlign: 'justify' }),
    },
  }
})

const formatButtons = computed(() => {
  let cmd = allCommands.value
  return [
    // cmd.p,
    cmd.h1,
    cmd.h2,
    cmd.h3,
    // ---
    cmd.bold,
    cmd.italic,
    cmd.underline,
    // ---
    // cmd.alignClear,
    cmd.alignLeft,
    cmd.alignCenter,
    cmd.alignRight,
    cmd.alignJustify,
  ]
})
</script>

<template>
  <BlockEditorLayout
    class="MediaHtmlBlockEditor"
    v-bind="$attrs"
    :block="block"
    @update:block="$emit('update:block', $event)"
  >
    <template #toolbar>
      <template
        v-for="(option, i) in formatButtons"
        :key="i"
      >
        <UiIcon
          v-if="option.icon"
          :src="option.icon"
          class="ui-clickable"
          :class="{'--active': option.isActive}"
          @click="option.callback"
        />
        <button
          v-else
          type="button"
          class="ui-clickable"
          :class="{'--active': option.isActive}"
          @click="option.callback"
          v-text="option.text"
        />
      </template>
    </template>

    <template #default>
      <EditorContent
        class="tiptap-editor-contents story-html"
        :editor="editor"
      />
    </template>
  </BlockEditorLayout>
</template>

<style lang="scss">
.tiptap-editor-contents [contenteditable] {
  min-height: 32px;
  outline: none;
}
</style>