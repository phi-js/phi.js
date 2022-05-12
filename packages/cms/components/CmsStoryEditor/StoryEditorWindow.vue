<script setup>
/*
Takes the same props as CmsStoryEditor
Presents a window with options for the current page and the story (style, dictionary, etc)
*/
import { ref, watch, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiWindow, UiTabs, UiTab, UiInput } from '@/packages/ui'

import BlockCssEditor from '../CmsBlockEditor/BlockCssEditor.vue'
import ListenersEditor from '../ListenersEditor/ListenersEditor.vue'
import StoryDictionaryEditor from './StoryDictionaryEditor.vue'
import StoryMethodsEditor from './StoryMethodsEditor.vue'

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
    'StoryEditorWindow.methods': 'Functions',
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
    'StoryEditorWindow.methods': 'Funciones',
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

// Pseudo events (?)
const storyEvents = computed({
  get() {
    return [
      {
        name: 'story.setup',
        stmt: innerStory.value.setup,
      },
      {
        name: 'page.setup',
        stmt: currentPage.value.setup,
      },
      {
        name: 'page.onEnter',
        stmt: currentPage.value.onEnter,
      },
      {
        name: 'page.onLeave',
        stmt: currentPage.value.onLeave,
      },
    ].filter((evt) => !!evt.stmt)
  },

  set(newValue) {
    innerStory.value.setup = null
    currentPage.value.setup = null
    currentPage.value.onEnter = null
    currentPage.value.onLeave = null

    newValue.forEach((evt) => {
      switch (evt.name) {
      case 'story.setup':
        innerStory.value.setup = evt.stmt
        break

      case 'page.setup':
        currentPage.value.setup = evt.stmt
        break

      case 'page.onEnter':
        currentPage.value.onEnter = evt.stmt
        break

      case 'page.onLeave':
        currentPage.value.onLeave = evt.stmt
        break
      }
    })

    emitCurrentPageUpdate()
  },
})

const availableEvents = computed(() => [
  {
    event: 'story.setup',
    text: i18n.t('StoryEditorWindow.events.storySetup'),
  },
  {
    event: 'page.setup',
    text: i18n.t('StoryEditorWindow.events.pageSetup'),
  },
  {
    event: 'page.onEnter',
    text: i18n.t('StoryEditorWindow.events.pageEnter'),
  },
  {
    event: 'page.onLeave',
    text: i18n.t('StoryEditorWindow.events.pageLeave'),
  },
])

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
          <ListenersEditor
            v-model="storyEvents"
            class="StoryEditorWindow__events"
            :available-events="availableEvents"
          />
        </UiTab>

        <UiTab
          value="i18n"
          icon="mdi:translate"
          :text="i18n.t('StoryEditorWindow.i18n')"
        >
          <StoryDictionaryEditor
            v-model:story="innerStory"
            @update:story="emitStoryUpdate"
          />
        </UiTab>

        <UiTab
          value="methods"
          icon="mdi:variable"
          :text="i18n.t('StoryEditorWindow.methods')"
        >
          <StoryMethodsEditor
            v-model:story="innerStory"
            @update:story="emitStoryUpdate"
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