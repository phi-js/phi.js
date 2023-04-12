<script setup>
import { ref, computed, onBeforeUnmount, watchEffect, watch, inject } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiIcon, UiPopover, UiButton, UiInput, UiDialog } from '@/packages/ui'

import googleTranslate from '../../../../components/CmsPropInput/types/googleTranslate'
import BlockScaffold from '../../../../components/BlockScaffold/BlockScaffold.vue'


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

const i18n = useI18n({
  en: {
    'MediaHtmlBlockEditor.Tanslate': 'Translate',
    'MediaHtmlBlockEditor.currentTab': 'Current tab',
    'MediaHtmlBlockEditor.newTab': 'New tab',
    'MediaHtmlBlockEditor.placeholder': 'Type here ...',
  },
  es: {
    'MediaHtmlBlockEditor.Tanslate': 'Traducir',
    'MediaHtmlBlockEditor.currentTab': 'Pestaña actual',
    'MediaHtmlBlockEditor.newTab': 'Nueva pestaña',
    'MediaHtmlBlockEditor.placeholder': 'Escribe aquí ...',
  },
})

const isLanguageOpen = ref(false)
const curLanguage = ref(i18n.language.value)

watch(i18n.language, (newValue) => curLanguage.value = newValue)

const innerValue = ref('')
const isFocused = ref(false)

const editor = new Editor({
  extensions: [
    StarterKit,
    Underline,
    Placeholder.configure({ placeholder: i18n.t('MediaHtmlBlockEditor.placeholder') }),
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

  if (!incomingValue?.['$i18n']) {
    targetValue = incomingValue
  } else if (incomingValue['$i18n']?.[curLanguage.value]) {
    targetValue = incomingValue['$i18n'][curLanguage.value]
  } else {
    targetValue = Object.values(incomingValue['$i18n'])?.[0] || ''
  }

  if (targetValue != innerValue.value) {
    innerValue.value = targetValue
  }
})


function setLanguage(newValue) {
  // emitUpdate()
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
        linkUrl.value = editor.getAttributes('link').href
        linkTarget.value = editor.getAttributes('link').target
        isLinkDialogOpen.value = true
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


const translateButtonEnabled = computed(() => {
  if (innerValue.value == '<p></p>') {
    return true
  }

  const incomingValue = props.block?.props?.value

  if (!incomingValue?.['$i18n']) {
    return true
  }

  if (!incomingValue['$i18n']?.[curLanguage.value]) {
    return true
  }

  if (incomingValue['$i18n'][curLanguage.value] == '<p></p>') {
    return true
  }

  return false
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

function toggleLanguageTabs() {
  isLanguageOpen.value = !isLanguageOpen.value

  // when closing, reset curLanguage
  if (!isLanguageOpen.value) {
    curLanguage.value = i18n.language.value
  }
}

/* Link dialog */
const injectedStory = inject('_cms_currentStory', null)
const injectedPages = computed(() => injectedStory?.value?.pages || [])
const pageOptions = computed(() => injectedPages.value.map((p) => ({
  value: `#p:${p.id}`,
  text: i18n.obj(p.title),
})))

const isLinkDialogOpen = ref(false)
const linkUrl = ref('')
const linkTarget = ref('')

function onDialogAccept() {
  if (linkUrl.value === '') {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .unsetLink()
      .run()
  } else {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: linkUrl.value,
        target: linkTarget.value || '_self',
      })
      .run()
  }

  isLinkDialogOpen.value = false
  linkUrl.value = ''
  linkTarget.value = ''
}

function onDialogCancel() {
  isLinkDialogOpen.value = false
  linkUrl.value = ''
  linkTarget.value = ''
}

const targetOptions = [
  { value: '_self', text: i18n.t('MediaHtmlBlockEditor.currentTab') },
  { value: '_blank', text: i18n.t('MediaHtmlBlockEditor.newTab') },
]
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
            class="BlockScaffold__button BlockScaffold__button--expansible"
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
              class="BlockScaffold__button"
              :class="{ 'BlockScaffold__button--active': cmd.isActive }"
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
            class="BlockScaffold__button BlockScaffold__button--expansible"
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
              class="BlockScaffold__button"
              :class="{ 'BlockScaffold__button--active': cmd.isActive }"
              @click="cmd.callback"
            />
          </div>
        </template>
      </UiPopover>

      <button
        v-for="(option, i) in formatButtons"
        :key="i"
        type="button"
        class="BlockScaffold__button"
        :class="{ 'BlockScaffold__button--active': option.isActive }"
        @click="option.callback"
        v-text="option.text"
      />

      <UiIcon
        :src="allCommands.link.icon"
        class="BlockScaffold__button"
        :class="{ 'BlockScaffold__button--active': allCommands.link.isActive }"
        @click="allCommands.link.callback()"
      />

      <UiIcon
        :src="allCommands.bulletList.icon"
        class="BlockScaffold__button"
        :class="{ 'BlockScaffold__button--active': allCommands.bulletList.isActive }"
        @click="allCommands.bulletList.callback()"
      />

      <UiIcon
        :src="allCommands.orderedList.icon"
        class="BlockScaffold__button"
        :class="{ 'BlockScaffold__button--active': allCommands.orderedList.isActive }"
        @click="allCommands.orderedList.callback()"
      />

      <UiIcon
        src="mdi:translate"
        class="BlockScaffold__button BlockScaffold__button--expansible"
        :class="{ 'BlockScaffold__button--active': isLanguageOpen }"
        @click="toggleLanguageTabs"
      />

      <div
        v-if="isLanguageOpen"
        class="MediaHtmlBlockEditor__languageTabs"
      >
        <UiInput
          v-if="isLanguageOpen"
          :model-value="curLanguage"
          type="select-native"
          :options="i18n.availableLanguages"
          @update:model-value="setLanguage($event)"
        />
        <UiButton
          :disabled="!translateButtonEnabled"
          :label="i18n.t('MediaHtmlBlockEditor.Tanslate')"
          icon="mdi:translate"
          class="UiButton--cancel"
          @click="doTranslation()"
        />
      </div>
    </template>

    <template #default>
      <EditorContentWrapper
        v-bind="block.props"
        :value="innerValue"
        :editor="editor"
      />

      <UiDialog
        v-model:open="isLinkDialogOpen"
        :close-button="false"
      >
        <form
          class="MediaHtmlBlockEditor__linkDialog"
          method="dialog"
          @submit="onDialogAccept"
        >
          <UiInput
            v-model="linkUrl"
            placeholder="URL"
          />
          <UiInput
            v-if="pageOptions.length"
            v-model="linkUrl"
            type="select-list"
            :options="pageOptions"
          />
          <UiInput
            v-model="linkTarget"
            type="select-list"
            :options="targetOptions"
          />

          <footer>
            <UiInput
              type="submit"
              :label="i18n.t('Accept')"
            />
            <UiInput
              type="button"
              class="UiButton--cancel"
              :label="i18n.t('Cancel')"
              @click="onDialogCancel"
            />
          </footer>
        </form>
      </UiDialog>
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
  &__languageTabs {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    background-color: #333;
    color: #eee;
    font-size: 10pt;

    order: 2;
    padding: 4px;
    gap: 4px;
  }

  &__linkDialog {
    padding: 5px;

    .UiInput {
      margin-bottom: 1em;
    }

    footer {
      display: flex;
      gap: 5px;
      padding: 5px;
    }
  }
}
</style>