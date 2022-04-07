<script setup>
/*
Takes the same props as CmsStoryEditor
Presents a window with options for the current page and the story (style, dictionary, etc)
*/
import { ref, watchEffect } from 'vue'
import { useI18n } from '../../../i18n'
import { UiWindow, UiTabs, UiTab, UiInput } from '../../../ui'
import { VmStatement } from '@/packages/vm/components'

import BlockCssEditor from '../CmsBlockEditor/BlockCssEditor.vue'
import StoryDictionaryEditor from './StoryDictionaryEditor.vue'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: null,
  },

  settings: {
    type: Object,
    required: false,
    default: null,
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },

  currentTab: {
    type: [Boolean, String],
    required: false,
    default: false,
  },

  allowSource: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:story', 'update:currentPageId', 'update:currentTab', 'accept', 'cancel'])


/* Internal values */
const innerStory = ref()
watchEffect(() => {
  innerStory.value = { ...props.story }
})

const currentPage = ref()
watchEffect(() => {
  const foundPage = innerStory.value.pages.find((p) => p.id == props.currentPageId)
  currentPage.value = foundPage || innerStory.value.pages?.[0]
})

function emitUpdate() {
  let currentPageIndex = innerStory.value.pages.findIndex((p) => p.id == props.currentPageId)
  if (currentPageIndex == -1) {
    currentPageIndex = 0
  }

  const updatedStory = {
    ...innerStory.value,
    pages: innerStory.value.pages.map((p, ndx) => {
      return ndx == currentPageIndex
        ? currentPage.value
        : p
    }),
  }

  emit('update:story', updatedStory)
}

const i18n = useI18n({
  en: {
    'StoryEditorWindow.events': 'Events',
    'StoryEditorWindow.global': 'Global',
    'StoryEditorWindow.i18n': 'Dictionary',
    'StoryEditorWindow.source': 'Source',
    'StoryEditorWindow.style': 'Style',
    'StoryEditorWindow.sitemap': 'Pages',
    'StoryEditorWindow.thisPage': 'This Page',
  },
  es: {
    'StoryEditorWindow.events': 'Eventos',
    'StoryEditorWindow.global': 'Global',
    'StoryEditorWindow.i18n': 'Diccionario',
    'StoryEditorWindow.source': 'Fuente',
    'StoryEditorWindow.style': 'Estilos',
    'StoryEditorWindow.sitemap': 'Páginas',
    'StoryEditorWindow.thisPage': 'Esta Página',
  },
})
</script>

<template>
  <UiWindow
    name="phi"
    class="StoryEditorWindow"
    :open="!!props.currentTab"
    @update:open="emit('update:currentTab', null)"
  >
    <template #default>
      <UiTabs
        :model-value="currentTab"
        @update:model-value="emit('update:currentTab', $event)"
      >
        <UiTab
          value="style"
          icon="mdi:palette-advanced"
          :text="i18n.t('StoryEditorWindow.style')"
        >
          <BlockCssEditor
            v-model="currentPage"
            @update:model-value="emitUpdate"
          />
        </UiTab>

        <UiTab
          value="events"
          icon="mdi:gesture-tap"
          :text="i18n.t('StoryEditorWindow.events')"
        >
          <div class="UiForm">
            <fieldset>
              <legend>story.setup()</legend>
              <VmStatement
                v-model="innerStory.setup"
                :default="{chain:[]}"
                @update:model-value="emitUpdate"
              />
            </fieldset>

            <fieldset>
              <legend>currentPage.setup()</legend>
              <VmStatement
                v-model="currentPage.setup"
                :default="{ chain: [] }"
                @update:model-value="emitUpdate"
              />
            </fieldset>
          </div>
        </UiTab>

        <UiTab
          value="i18n"
          icon="mdi:translate"
          :text="i18n.t('StoryEditorWindow.i18n')"
        >
          <StoryDictionaryEditor
            v-model:story="innerStory"
            @update:model-value="emitUpdate"
          />
        </UiTab>

        <UiTab
          v-if="props.allowSource"
          value="source"
          icon="mdi:code-json"
          :text="i18n.t('StoryEditorWindow.source')"
        >
          <div class="StoryEditorWindow__tab PageSettings">
            <UiTabs>
              <UiTab
                :text="i18n.t('StoryEditorWindow.thisPage')"
                icon="mdi:code-json"
                value="source-page"
              >
                <UiInput
                  v-model="currentPage"
                  type="json"
                  @update:model-value="emitUpdate"
                />
              </UiTab>

              <UiTab
                :text="i18n.t('StoryEditorWindow.global')"
                icon="mdi:code-json"
                value="source-story"
              >
                <UiInput
                  v-model="innerStory"
                  type="json"
                  @update:model-value="emitUpdate"
                />
              </UiTab>
            </UiTabs>
          </div>
        </UiTab>
      </UiTabs>
    </template>
    <template #footer="{ close }">
      <button
        type="button"
        class="UiButton UiButton--main"
        @click="emit('accept'); close();"
        v-text="i18n.t('Accept')"
      />
      <button
        type="button"
        class="UiButton UiButton--cancel"
        @click="emit('cancel'); close();"
        v-text="i18n.t('Cancel')"
      />
    </template>
  </UiWindow>
</template>