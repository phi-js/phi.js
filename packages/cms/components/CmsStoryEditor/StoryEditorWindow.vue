<script setup>
/*
Takes the same props as CmsStoryEditor
Presents a window with options for the current page and the story (style, dictionary, etc)
*/
import { ref, watch, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiWindow, UiTabs, UiTab, UiInput, UiItem } from '@/packages/ui'

import CmsStoryStyle from '../CmsStoryStyle/CmsStoryStyle.vue'
import ListenersEditor from '../ListenersEditor/ListenersEditor.vue'
import StoryDictionaryEditor from './StoryDictionaryEditor.vue'
import StoryMethodsEditor from './StoryMethodsEditor.vue'
import StoryComputedEditor from './StoryComputedEditor.vue'

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

    if (!innerStory.value?.pages?.length) {
      return // .... hmmmm
    }

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
    'StoryEditorWindow.code': 'Code',
    'StoryEditorWindow.global': 'Global',
    'StoryEditorWindow.i18n': 'Languages',
    'StoryEditorWindow.computedVariables': 'Computed variables',
    'StoryEditorWindow.methods': 'Functions',
    'StoryEditorWindow.source': 'Source',
    'StoryEditorWindow.style': 'Style',
    'StoryEditorWindow.sitemap': 'Pages',
    'StoryEditorWindow.thisPage': 'This Page',

    'StoryEditorWindow.events.storySetup': 'The document is loaded',
    'StoryEditorWindow.events.pageSetup': 'The page is loaded',
    'StoryEditorWindow.events.pageEnter': 'User enters the page',
    'StoryEditorWindow.events.pageLeave': 'User leaves the page',
  },
  es: {
    'StoryEditorWindow.events': 'Eventos',
    'StoryEditorWindow.code': 'Código',
    'StoryEditorWindow.global': 'Global',
    'StoryEditorWindow.i18n': 'Idiomas',
    'StoryEditorWindow.computedVariables': 'Variables computadas',
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
      {
        name: 'page.onSubmit',
        stmt: currentPage.value['v-on']?.submit,
      },
      {
        name: 'page.onChange',
        stmt: currentPage.value['v-on']?.change,
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

      case 'page.onSubmit':
        if (typeof currentPage.value['v-on'] == 'undefined') {
          currentPage.value['v-on'] = {}
        }
        currentPage.value['v-on'].submit = evt.stmt
        break

      case 'page.onChange':
        if (typeof currentPage.value['v-on'] == 'undefined') {
          currentPage.value['v-on'] = {}
        }
        currentPage.value['v-on'].change = evt.stmt
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
  {
    event: 'page.onSubmit',
    text: 'onSubmit',
  },
  {
    event: 'page.onChange',
    text: 'onChange',
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
    <template #header>
      <UiItem
        class="StoryEditorWindow__header"
        :text="i18n.t('StoryEditorWindow.' + props.currentTab)"
      />
    </template>

    <template #default>
      <div
        v-if="currentTab == 'style'"
        class="contents-style"
      >
        <CmsStoryStyle
          v-model:story="innerStory"
          @update:story="emitStoryUpdate"
        />
      </div>
      <div
        v-if="currentTab == 'code'"
        class="contents-code"
      >
        <UiTabs>
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
            value="computed"
            icon="mdi:variable"
            :text="i18n.t('StoryEditorWindow.computedVariables')"
          >
            <StoryComputedEditor
              v-model="innerStory.computed"
              class="StoryEditorWindow__computed"
              @update:model-value="emitStoryUpdate"
            />
          </UiTab>

          <UiTab
            value="methods"
            icon="mdi:variable"
            :text="i18n.t('StoryEditorWindow.methods')"
          >
            <StoryMethodsEditor
              v-model:story="innerStory"
              class="StoryEditorWindow__methods"
              @update:story="emitStoryUpdate"
            />
          </UiTab>
        </UiTabs>
      </div>
      <div
        v-if="currentTab == 'i18n'"
        class="contents-i18n"
      >
        <StoryDictionaryEditor
          v-model:story="innerStory"
          @update:story="emitStoryUpdate"
        />
      </div>
      <div
        v-if="currentTab == 'source'"
        class="StoryEditorWindow__tab contents-source"
      >
        <UiInput
          v-model="innerStory"
          type="json"
          @update:model-value="emitStoryUpdate"
        />
        <!-- <UiTabs>
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
        </UiTabs> -->
      </div>
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

<style lang="scss">
.StoryEditorWindow {
  &__header {
    --ui-item-padding: 8px 12px;
  }


  // Make sure the source editor stretches to the full window content
  .contents-source {
    height: 100%;

    & > .UiInput,
    & > .UiInput > .UiInput__body,
    & > .UiInput > .UiInput__body > .UiInputJson {
      height: 100%;
    }
    .UiInputCode {
      flex: 1;
      overflow: auto;
      & > div { //cm-editor
        height: 100%;
      }
    }
  }
}
</style>