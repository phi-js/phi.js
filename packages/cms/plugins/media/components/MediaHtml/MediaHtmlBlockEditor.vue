<script setup>
import { ref, computed, onBeforeUnmount, watchEffect } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiIcon, UiPopover, UiTabs, UiTab, UiButton } from '@/packages/ui'

import BlockScaffold from '../../../../components/CmsSlotEditor/Bloh.vue'

import googleTranslate from '../../../../components/CmsPropInput/types/googleTranslate'

import { Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'

import EditorContentWrapper from './EditorContentWrapper.vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:block', 'select', 'focus', 'blur'])

const i18n = useI18n()
const curLanguage = ref(i18n.locale)
const isLanguageOpen = ref(false)

const innerValue = ref('')
const isFocused = ref(false)

const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
    Placeholder.configure({ placeholder: 'Escribe aquí ...' }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    Link.configure({
      openOnClick: false,
      autolink: false,
    }),
  ],
  content: '',
  onFocus: ({ event }) => {
    emit('select')

    isFocused.value = true
    emit('focus', event)
  },
  onBlur: ({ event }) => {
    isFocused.value = false
    emit('blur', event)
  },
  onUpdate: () => {
    innerValue.value = editor.getHTML()
    emitUpdate()
  },
})

function emitUpdate() {
  const objValue = props.block?.props?.value?.['$i18n']
    ? { ...props.block.props.value }
    : { $i18n: {} }

  objValue['$i18n'][curLanguage.value] = innerValue.value
  emit('update:block', { ...props.block, props: { ...props.block.props, value: objValue } })
}

onBeforeUnmount(() => editor.destroy())

defineExpose({ focus: () => editor.commands.focus() })

watchEffect(() => {
  const incomingValue = props.block?.props?.value
  let targetValue = ''

  if (incomingValue?.['$i18n'] && typeof incomingValue?.['$i18n'] === 'object') {
    targetValue = incomingValue['$i18n']?.[curLanguage.value]
      || incomingValue['$i18n'][Object.keys(incomingValue['$i18n'])[0]]
  } else {
    targetValue = incomingValue
  }

  if (targetValue != innerValue.value) {
    innerValue.value = targetValue
  }
})


function setLanguage(newValue) {
  emitUpdate()
  curLanguage.value = newValue
}


// toggleHeading clears textAlign (tiptap bug?)
// keep alignment on toggleHeading;
function toggleHeading(level) {
  // Determine current textAlign  (there is no _known_ method to get the set value :()
  const curTextAlign =
    editor.isActive({ textAlign: 'left' }) ? 'left'
      : editor.isActive({ textAlign: 'center' }) ? 'center'
        : editor.isActive({ textAlign: 'right' }) ? 'right'
          : editor.isActive({ textAlign: 'justify' }) ? 'justify'
            : null

  const chain = editor.chain().focus().toggleHeading({ level })
  if (curTextAlign) {
    chain.setTextAlign(curTextAlign)
  }

  return chain.run()
}

const allCommands = computed(() => {
  return {
    p: {
      text: 'P',
      callback: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive('paragraph'),
    },

    h1: {
      text: 'H1',
      callback: () => toggleHeading(1),
      isActive: editor.isActive('heading', { level: 1 }),
    },

    h2: {
      text: 'H2',
      callback: () => toggleHeading(2),
      isActive: editor.isActive('heading', { level: 2 }),
    },

    h3: {
      text: 'H3',
      callback: () => toggleHeading(3),
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

    link: {
      icon: 'mdi:link',
      text: 'link',
      callback: () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)

        // cancelled
        if (url === null) {
          return
        }

        // empty
        if (url === '') {
          editor
            .chain()
            .focus()
            .extendMarkRange('link')
            .unsetLink()
            .run()

          return
        }

        // update link
        editor
          .chain()
          .focus()
          .extendMarkRange('link')
          .setLink({
            href: url,
            target: url.startsWith('http') ? '_blank' : '_self',
          })
          .run()
      },
      isActive: editor.isActive('link'),
    },

    bulletList: {
      icon: 'mdi:format-list-bulleted',
      text: 'ul',
      callback: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
    },

    orderedList: {
      icon: 'mdi:format-list-numbered',
      text: 'ol',
      callback: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
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

async function doTranslation() {
  const dictionary = props.block?.props?.value?.$i18n
  if (!dictionary || typeof dictionary !== 'object') {
    return
  }

  const sourceLanguage = Object.keys(dictionary)[0]
  const sourceValue = dictionary[sourceLanguage]
  const targetLanguage = curLanguage.value

  // const results = await googleTranslate([sourceValue], targetLanguage, sourceLanguage)
  const results = await googleTranslate([sourceValue], targetLanguage)
  if (results?.[0]) {
    innerValue.value = results?.[0]
    emitUpdate()
  }
}
</script>

<template>
  <BlockScaffold
    class="MediaHtmlBlockEditor"
    :block="props.block"
  >
    <template #toolbar>
      <UiPopover>
        <template #trigger>
          <button
            type="button"
            class="BlockScaffold__toolbar-icon expansible"
            v-text="heading.current.text"
          />
        </template>
        <template #contents="{ close }">
          <div
            class="UiGroup"
            @click="close"
          >
            <button
              v-for="(cmd, i) in heading.available"
              :key="i"
              type="button"
              class="BlockScaffold__toolbar-icon"
              :class="{ 'BlockScaffold__toolbar-icon--active': cmd.isActive }"
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
            class="BlockScaffold__toolbar-icon expansible"
          />
        </template>
        <template #contents="{ close }">
          <div
            class="UiGroup"
            @click="close"
          >
            <UiIcon
              v-for="(cmd, i) in alignment.available"
              :key="i"
              :src="cmd.icon"
              class="BlockScaffold__toolbar-icon"
              :class="{ 'BlockScaffold__toolbar-icon--active': cmd.isActive }"
              @click="cmd.callback"
            />
          </div>
        </template>
      </UiPopover>

      <button
        v-for="(option, i) in formatButtons"
        :key="i"
        type="button"
        class="BlockScaffold__toolbar-icon"
        :class="{ 'BlockScaffold__toolbar-icon--active': option.isActive }"
        @click="option.callback"
        v-text="option.text"
      />

      <UiIcon
        :src="allCommands.link.icon"
        class="BlockScaffold__toolbar-icon"
        :class="{ 'BlockScaffold__toolbar-icon--active': allCommands.link.isActive }"
        @click="allCommands.link.callback()"
      />

      <UiIcon
        :src="allCommands.bulletList.icon"
        class="BlockScaffold__toolbar-icon"
        :class="{ 'BlockScaffold__toolbar-icon--active': allCommands.bulletList.isActive }"
        @click="allCommands.bulletList.callback()"
      />

      <UiIcon
        :src="allCommands.orderedList.icon"
        class="BlockScaffold__toolbar-icon"
        :class="{ 'BlockScaffold__toolbar-icon--active': allCommands.orderedList.isActive }"
        @click="allCommands.orderedList.callback()"
      />

      <UiIcon
        src="mdi:translate"
        class="BlockScaffold__toolbar-icon expansible"
        :class="{ 'BlockScaffold__toolbar-icon--active': isLanguageOpen }"
        @click="isLanguageOpen = !isLanguageOpen"
      />
    </template>

    <template #default>
      <div class="MediaHtmlBlockEditor">
        <UiTabs
          v-if="isLanguageOpen"
          class="MediaHtmlBlockEditor__tabs"
          :model-value="curLanguage"
          @update:model-value="setLanguage($event)"
        >
          <template #default>
            <UiTab
              v-for="(locale) in i18n.availableLocales.value"
              :key="locale.value"
              :text="locale.text"
              :value="locale.value"
            />
          </template>

          <template #right>
            <UiButton
              v-show="curLanguage != 'en'"
              label="Translate"
              icon="mdi:translate"
              class="UiButton--cancel"
              @click="doTranslation()"
            />
          </template>
        </UiTabs>

        <EditorContentWrapper
          :value="innerValue"
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
  // min-height: 32px;
  outline: none;
}

.MediaHtmlBlockEditor {
  .expansible {
    &::after {
      content: "▾";
    }
  }

  &__tabs {
    background-color: #333;
    color: #eee;
  }
}
</style>