<script setup>
/*
Takes the same props as CmsStoryEditor
Presents a window with options for the current page and the story (style, dictionary, etc)
*/
import { ref, watch } from 'vue'
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
})

const emit = defineEmits(['update:story', 'update:currentPageId', 'update:currentTab', 'accept', 'cancel'])


/* Internal values */
const innerStory = ref()
const currentPage = ref()

watch(
  () => props.story,
  (newStory) => {
    innerStory.value = JSON.parse(JSON.stringify(newStory))
    const foundPageIndex = innerStory.value.pages.findIndex((p) => p.id == props.currentPageId)
    currentPage.value = foundPageIndex >= 0 ? innerStory.value.pages?.[foundPageIndex] : innerStory.value.pages?.[0]
  },
  { immediate: true },
)

watch(
  () => props.currentPageId,
  (newPageId) => {
    const foundPageIndex = innerStory.value.pages.findIndex((p) => p.id == newPageId)
    currentPage.value = foundPageIndex >= 0 ? innerStory.value.pages?.[foundPageIndex] : innerStory.value.pages?.[0]
  },
  { immediate: true },
)

function emitStoryUpdate() {
  emit('update:story', { ...innerStory.value })
}

function emitCurrentPageUpdate() {
  emit('update:story', {
    ...innerStory.value,
    pages: innerStory.value.pages.map((page) => page.id == currentPage.value?.id ? currentPage.value : page),
  })
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

    'StoryEditorWindow.events.storySetup': 'on story setup',
    'StoryEditorWindow.events.pageSetup': 'on page setup',
    'StoryEditorWindow.events.pageEnter': 'on page enter',
    'StoryEditorWindow.events.pageLeave': 'on page leavae',
  },
  es: {
    'StoryEditorWindow.events': 'Eventos',
    'StoryEditorWindow.global': 'Global',
    'StoryEditorWindow.i18n': 'Diccionario',
    'StoryEditorWindow.source': 'Fuente',
    'StoryEditorWindow.style': 'Estilos',
    'StoryEditorWindow.sitemap': 'Páginas',
    'StoryEditorWindow.thisPage': 'Esta Página',

    'StoryEditorWindow.events.storySetup': 'Inicializar documento',
    'StoryEditorWindow.events.pageSetup': 'Inicializar página',
    'StoryEditorWindow.events.pageEnter': 'Al entrar a ésta página',
    'StoryEditorWindow.events.pageLeave': 'Al salir de ésta página',
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
            @update:model-value="emitCurrentPageUpdate"
          />
        </UiTab>

        <UiTab
          value="events"
          icon="mdi:gesture-tap"
          :text="i18n.t('StoryEditorWindow.events')"
        >
          <div class="StoryEditorWindow__events UiForm">
            <details>
              <summary>{{ i18n.t('StoryEditorWindow.events.storySetup') }}</summary>
              <VmStatement
                v-model="innerStory.setup"
                :default="{chain:[]}"
                @update:model-value="emitStoryUpdate"
              />
            </details>

            <details>
              <summary>{{ i18n.t('StoryEditorWindow.events.pageSetup') }}</summary>
              <VmStatement
                v-model="currentPage.setup"
                :default="{ chain: [] }"
                @update:model-value="emitCurrentPageUpdate"
              />
            </details>

            <details>
              <summary>{{ i18n.t('StoryEditorWindow.events.pageEnter') }}</summary>
              <VmStatement
                v-model="currentPage.onEnter"
                :default="{ chain: [] }"
                @update:model-value="emitCurrentPageUpdate"
              />
            </details>

            <details>
              <summary>{{ i18n.t('StoryEditorWindow.events.pageLeave') }}</summary>
              <VmStatement
                v-model="currentPage.onLeave"
                :default="{ chain: [] }"
                @update:model-value="emitCurrentPageUpdate"
              />
            </details>
          </div>
        </UiTab>

        <UiTab
          value="i18n"
          icon="mdi:translate"
          :text="i18n.t('StoryEditorWindow.i18n')"
        >
          <StoryDictionaryEditor
            v-model:story="innerStory"
            @update:model-value="emitStoryUpdate"
          />
        </UiTab>

        <UiTab
          value="source"
          icon="mdi:code-json"
          :text="i18n.t('StoryEditorWindow.source')"
        >
          <div class="StoryEditorWindow__tab">
            <UiTabs>
              <UiTab
                :text="i18n.t('StoryEditorWindow.thisPage')"
                icon="mdi:code-json"
                value="source-page"
              >
                <UiInput
                  v-model="currentPage"
                  type="json"
                  @update:model-value="emitCurrentPageUpdate"
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
                  @update:model-value="emitStoryUpdate"
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