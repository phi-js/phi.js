<template>
  <BlockEditorLayout class="MediaHtmlBlockEditor">
    <template #toolbar>
      <select
        v-model="selectValue"
        class="ui-clickable"
      >
        <option value="p">
          P
        </option>
        <option value="h1">
          H1
        </option>
        <option value="h2">
          H2
        </option>
        <option value="h3">
          H3
        </option>
      </select>

      <button
        v-for="(option, i) in formatButtons"
        :key="i"
        type="button"
        class="ui-clickable"
        :class="{'--active': option.isActive}"
        @click="option.callback"
        v-text="option.text"
      />
    </template>

    <template #default>
      <EditorContent
        class="tiptap-editor-contents story-html"
        :editor="editor"
      />
    </template>
  </BlockEditorLayout>
</template>

<script>
// import { Editor, EditorContent } from 'tiptap'

// import {
//   Bold,
//   Code,
//   Italic,
//   Link,
//   Underline,
//   Heading,
//   History,
//   Placeholder,
//   HardBreak,
//   // Image,
// } from 'tiptap-extensions'
// // import Image from './tiptap/Img.js'

import { Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'


import BlockEditorLayout from '../../../../components/CmsBlockEditor/BlockEditorLayout.vue'
export default {
  name: 'MediaHtmlBlockEditor',

  components: { BlockEditorLayout, EditorContent },

  props: {
    block: {
      type: Object,
      required: true,
    },
  },

  emits: ['update:block', 'focus', 'blur'],

  data() {
    return {
      innerValue: '',

      // Create an `Editor` instance with some default content. The editor is
      // then passed to the `EditorContent` component as a `prop`
      editor: new Editor({
        extensions: [
          StarterKit,
          Underline,
          // new Bold(),
          // new Code(),
          // new Italic(),
          // new Link(),
          // new Underline(),
          // new Heading({ levels: [1, 2, 3] }),
          // new HardBreak(),
          // new History(),
          // // new Image(),

          // new Placeholder({
          //   emptyEditorClass: 'is-editor-empty',
          //   emptyNodeClass: 'is-empty',
          //   emptyNodeText: 'Escribe aqui ...',
          //   showOnlyWhenEditable: true,
          //   showOnlyCurrent: true,
          // }),
        ],

        content: '',

        onUpdate: () => {
          // get new content on update
          this.innerValue = this.editor.getHTML()
          this.emitInput()
        },

        onFocus: () => {
          this.$emit('focus')
        },

        onBlur: () => {
          this.$emit('blur')
        },
      }),
    }
  },

  computed: {
    selectValue: {
      get() {
        let options = ['p', 'h1', 'h2', 'h3']
        for (let i = 0; i < options.length; i++) {
          let optionName = options[i]
          if (
            this.allCommands[optionName] &&
            this.allCommands[optionName].isActive
          ) {
            return optionName
          }
        }

        return 'p'
      },

      set(newValue) {
        if (!this.allCommands[newValue]) {
          return
        }

        this.allCommands[newValue].callback()
      },
    },

    allCommands() {
      return {
        p: {
          text: 'P',
          callback: () => this.editor.chain().focus().setParagraph().run(),
          isActive: this.editor.isActive('paragraph'),
        },
        h1: {
          text: 'H1',
          callback: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: this.editor.isActive('heading', { level: 1 }),
        },
        h2: {
          text: 'H2',
          callback: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: this.editor.isActive('heading', { level: 2 }),
        },
        h3: {
          text: 'H3',
          callback: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: this.editor.isActive('heading', { level: 3 }),
        },
        bold: {
          text: 'B',
          callback: () => this.editor.chain().focus().toggleBold().run(),
          isActive: this.editor.isActive('bold'),
        },
        italic: {
          text: 'I',
          callback: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: this.editor.isActive('italic'),
        },
        underline: {
          text: 'U',
          callback: () => this.editor.chain().focus().toggleUnderline().run(),
          isActive: this.editor.isActive('underline'),
        },
      }
    },

    formatButtons() {
      return [
        this.allCommands.bold,
        this.allCommands.italic,
        this.allCommands.underline,
      ]
    },
  },

  watch: {
    block: {
      immediate: true,
      handler(newValue) {
        let incomingValue =
          newValue && newValue.props && newValue.props.value
            ? newValue.props.value
            : ''

        if (incomingValue != this.innerValue) {
          this.innerValue = incomingValue
          this.editor.commands.setContent(this.innerValue, false)
        }
      },
    },
  },

  beforeUnmount() {
    this.editor.destroy()
  },

  methods: {
    emitInput() {
      let clone = JSON.parse(JSON.stringify(this.block))
      clone.props = Object.assign({}, clone.props, { value: this.innerValue })
      this.$emit('update:block', clone)
    },
  },
}
</script>

<style lang="scss">
.tiptap-editor-contents [contenteditable] {
  min-height: 32px;
  outline: none;
}
</style>