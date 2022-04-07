<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { UiIcon, UiPopover } from '@/packages/ui/components'
import BlockScaffold from '../../../../components/CmsBlockEditor/BlockScaffold.vue'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:block'])

const innerValue = ref('')
const isFocused = ref(false)

const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
    Placeholder.configure({ placeholder: 'Escribe aquí ...' }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ],
  content: '',
  onFocus: () => isFocused.value = true,
  onBlur: () => isFocused.value = false,
  onUpdate: () => {
    innerValue.value = editor.getHTML()
    emit('update:block', { ...props.block, props: { ...props.block.props, value: innerValue.value } })
  },
})

onBeforeUnmount(() => editor.destroy())

watch(
  () => props.block?.props?.value,
  (incomingValue) => {
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
  const cmd = allCommands.value
  return [
    cmd.bold,
    cmd.italic,
    cmd.underline,
  ]
})

const heading = computed(() => {
  const cmd = allCommands.value
  const available = [
    cmd.p,
    cmd.h1,
    cmd.h2,
    cmd.h3,
  ]

  const current = available.find((c) => c.isActive) || available[0]
  return { current, available }
})

const alignment = computed(() => {
  const cmd = allCommands.value
  const available = [
    cmd.alignLeft,
    cmd.alignCenter,
    cmd.alignRight,
    cmd.alignJustify,
  ]

  const current = available.find((c) => c.isActive) || available[0]
  return { current, available }
})

</script>

<template>
  <BlockScaffold
    class="MediaHtmlBlockEditor BlockScaffold--default"
    v-bind="$attrs"
    :block="props.block"
    :focused="isFocused"
    @update:block="$emit('update:block', $event)"
  >
    <template #toolbar>
      <UiPopover>
        <template #trigger>
          <button
            type="button"
            class="ui--clickable expansible"
            v-text="heading.current.text"
          />
        </template>
        <template #contents="{ close }">
          <div
            class="UiGroup UiToolbar"
            @click="close"
          >
            <button
              v-for="(cmd, i) in heading.available"
              :key="i"
              type="button"
              class="ui--clickable"
              :class="{ '--active': cmd.isActive }"
              @click="cmd.callback"
              v-text="cmd.text"
            />
          </div>
        </template>
      </UiPopover>

      <UiPopover>
        <template #trigger>
          <UiIcon
            :src="alignment.current.icon"
            class="ui--clickable expansible"
          />
        </template>
        <template #contents="{ close }">
          <div
            class="UiGroup UiToolbar"
            @click="close"
          >
            <UiIcon
              v-for="(cmd, i) in alignment.available"
              :key="i"
              :src="cmd.icon"
              class="ui--clickable"
              :class="{ '--active': cmd.isActive }"
              @click="cmd.callback"
            />
          </div>
        </template>
      </UiPopover>

      <button
        v-for="(option, i) in formatButtons"
        :key="i"
        type="button"
        class="ui--clickable text-format-button"
        :class="{ '--active': option.isActive }"
        @click="option.callback"
        v-text="option.text"
      />
    </template>

    <template #default="{ blockCssAttributes }">
      <div v-bind="blockCssAttributes">
        <EditorContent
          class="tiptap-editor-contents story-html"
          :editor="editor"
        />
      </div>
    </template>
  </BlockScaffold>
</template>

<style lang="scss">
// SERIOUSLY ?! https://tiptap.dev/api/extensions/placeholder
/* Placeholder (at the top) */
.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.tiptap-editor-contents [contenteditable] {
  min-height: 32px;
  outline: none;
}

.MediaHtmlBlockEditor {
  .text-format-button {
    min-width: 34px !important;
  }

  .expansible {
    &::after {
      content: "▾";
    }
  }
}
</style>