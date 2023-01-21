<script setup>
import { provide, ref, computed, watch, shallowRef, onMounted, onUnmounted } from 'vue'
import { CmsStory } from '../CmsStory'
import CmsStoryEditor from '../CmsStoryEditor/CmsStoryEditor.vue'

import StoryEditorWindow from '../CmsStoryEditor/StoryEditorWindow.vue'
import BlockWindow from '../CmsBlockEditor/BlockWindow.vue'
import StoryPageList from './StoryPageList.vue'
import { getStoryFields, sanitizeStory } from '../../functions'

import { useI18n } from '../../../i18n'
import {
  UiTabs,
  UiTab,
  UiItem,
  UiIcon,
  UiWindow,
  UiInput,
  UiContentWrapper,
  UiResolutionPicker,
} from '@/packages/ui'

import { useUndo } from '@/packages/ui/helpers'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: null,
  },

  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  tab: {
    type: String,
    required: false,
    default: 'editor', // editor | preview
  },

  contentSize: {
    type: Object,
    required: false,
    default: () => ({
      width: null,
      height: null,
    }),
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },

  /*
  Settings object
  {
    allowSource: false, // Show "Source" editor in blocks and main toolbar.  default: false
  }
  */
  settings: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits([
  'story-emit',
  'update:story',
  'update:modelValue',
  'update:tab',
  'update:contentSize',
  'update:currentPageId',
])

const contentSize = ref()
watch(
  () => props.contentSize,
  (newValue) => contentSize.value = newValue,
  { immediate: true },
)

const i18n = useI18n({
  en: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Style': 'Style',
    'CmsStoryBuilder.Code': 'Code',
    'CmsStoryBuilder.Languages': 'Languages',
    'CmsStoryBuilder.Source': 'Source',
    'CmsStoryBuilder.Preview': 'Preview',
    'CmsStoryBuilder.DataExplorer': 'Debugger',
    'CmsStoryBuilder.Undo': 'Undo',
    'CmsStoryBuilder.Redo': 'Redo',
    'CmsStoryBuilder.hideToolbar': 'Close editor',
  },
  es: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Style': 'Estilo',
    'CmsStoryBuilder.Code': 'Código',
    'CmsStoryBuilder.Languages': 'Idiomas',
    'CmsStoryBuilder.Source': 'Fuente',
    'CmsStoryBuilder.Preview': 'Vista previa',
    'CmsStoryBuilder.DataExplorer': 'Depurador',
    'CmsStoryBuilder.Undo': 'Deshacer',
    'CmsStoryBuilder.Redo': 'Rehacer',
    'CmsStoryBuilder.hideToolbar': 'Cerrar editor',
  },
})

// inner story value
const innerStory = ref()
watch(
  () => props.story,
  (newValue) => {
    innerStory.value = sanitizeStory(JSON.parse(JSON.stringify(newValue)))
  },
  { immediate: true },
)
provide('_cms_currentStory', innerStory)


const innerCurrentPageId = ref()

const currentPageId = computed({
  get() {
    return props.currentPageId || innerCurrentPageId.value || innerStory.value?.pages?.[0]?.id
  },
  set(newPageId) {
    innerCurrentPageId.value = newPageId
    emit('update:currentPageId', newPageId)
  },
})


// Used by VmExpressionPicker
provide('$_vm_functions', computed(() => {
  if (!innerStory.value.methods?.length) {
    return []
  }
  return [{
    name: 'functions',
    title: 'Functions',
    children: innerStory.value.methods
      .map((storyMethod) => ({
        name: storyMethod.name,
        icon: 'mdi:code-parentheses-box',
        title: storyMethod.name,
        expression: {
          call: 'Story.call',
          args: { fn: storyMethod.name },
        },
      })),
  }]
}))


// Current page (specified by currentPageId)
const currentPage = computed(() => {
  if (!innerStory.value?.pages?.length) {
    return null
  }

  const foundPage = innerStory.value.pages.find((p) => p.id == currentPageId.value)
  return foundPage || innerStory.value.pages[0]
})

const currentTab = ref()

watch(
  () => props.tab,
  (newValue) => currentTab.value = newValue,
  { immediate: true },
)

const isEditorLoaded = ref()
watch(
  currentTab,
  (newValue) => {
    if (newValue == 'editor') {
      isEditorLoaded.value = true
    }
  },
  { immediate: true },
)

// CTRL+Space to toggle between editor and preview tabs
function onKeyDown(event) {
  if (event.code == 'Space' && event.ctrlKey) {
    if (currentTab.value == 'editor') {
      currentTab.value = 'preview'
    } else {
      currentTab.value = 'editor'
    }
    emit('update:tab', currentTab.value)
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})


const windowTab = ref()
const isSitemapOpen = ref(false)

function onUpdateStory() {
  // record change in undo history
  push(innerStory.value)

  emit('update:story', { ...innerStory.value })
}


// Intermediate story value in UiStoryWindow
function onWindowAccept() {
  onUpdateStory()
}

function onWindowCancel() {
  // innerStory.value = { ...props.story }
  innerStory.value = JSON.parse(JSON.stringify(props.story))
}


// Block editor window (singleton in the story builder)
const editingBlock = shallowRef() // Instance of SlotItem
const currentActionId = ref()

function openBlockWindow(SlotBlock, actionId = null) {
  editingBlock.value = SlotBlock
  currentActionId.value = actionId
}

function closeBlockWindow() {
  editingBlock.value = null
}

provide('$_cms_openBlockWindow', openBlockWindow)


const editingPageIndex = ref(-1)
const editingPage = computed({
  get() {
    if (editingPageIndex.value == -1) {
      return null
    }

    return innerStory.value.pages[editingPageIndex.value]
  },
  set(newPage) {
    if (editingPageIndex.value == -1) {
      return
    }
    innerStory.value.pages[editingPageIndex.value] = newPage
  },
})


function onOpenEditor({ index, actionId }) {
  editingPageIndex.value = index
  openBlockWindow(
    {
      innerBlock: editingPage,
      updateBlock: () => {
        onUpdateStory()
        editingPageIndex.value = -1
      },
      cancel: () => {
        editingPageIndex.value = -1
      },
    },
    actionId,
  )
}




const storyFields = computed(() => {
  return [{
    text: 'Variables',
    children: getStoryFields(innerStory.value),
  }]
})
provide('$_vm_fields', storyFields)


// undo/redo functionality
const { push, undo, redo, hasUndo, hasRedo } = useUndo(innerStory.value, (newValue) => {
  innerStory.value = newValue
  emit('update:story', { ...innerStory.value })
})

const isModelExplorerOpen = ref(false)
</script>

<template>
  <div class="CmsStoryBuilder">
    <div class="CmsStoryBuilder__header">
      <UiTabs
        v-model="currentTab"
        class="CmsStoryBuilder__tabs"
        @update:model-value="emit('update:tab', $event)"
      >
        <template #left>
          <slot name="header" />
        </template>

        <template #default>
          <UiTab
            :text="i18n.t('CmsStoryBuilder.Editor')"
            value="editor"
          />
          <UiTab
            :text="i18n.t('CmsStoryBuilder.Preview')"
            value="preview"
          />
          <slot name="tabs" />
        </template>

        <template #right>
          <div class="CmsStoryBuilder__controls">
            <UiIcon
              class="CmsStoryBuilder__controlItem"
              src="mdi:arrow-u-left-top"
              :title="i18n.t('CmsStoryBuilder.Undo')"
              :disabled="!hasUndo"
              @click="undo()"
            />
            <UiIcon
              class="CmsStoryBuilder__controlItem"
              src="mdi:arrow-u-right-top"
              :title="i18n.t('CmsStoryBuilder.Redo')"
              :disabled="!hasRedo"
              @click="redo()"
            />
            <UiResolutionPicker
              v-model="contentSize"
              class="CmsStoryBuilder__controlItem"
              @update:model-value="emit('update:contentSize', $event)"
            />

            <slot name="controls" />
          </div>
        </template>
      </UiTabs>

      <!-- EDITOR SUBTABS-->
      <div
        v-if="currentTab == 'editor'"
        class="CmsStoryBuilder__tabOptions"
      >
        <UiItem
          class="CmsStoryBuilder__tabItem CmsStoryBuilder__tabItem--sitemap"
          :class="{'CmsStoryBuilder__tabItem--sitemap-open': isSitemapOpen}"
          @click="isSitemapOpen = !isSitemapOpen"
          @click-actions="isSitemapOpen = !isSitemapOpen"
        >
          <template #default>
            <strong>#</strong><span>{{ currentPage?.hash }}</span>
          </template>
          <template #actions>
            <UiIcon :src="isSitemapOpen ? 'mdi:close' : 'mdi:menu-down'" />
          </template>
        </UiItem>

        <UiItem
          class="CmsStoryBuilder__tabItem"
          :text="i18n.t('CmsStoryBuilder.Style')"
          icon="mdi:water"
          :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'style'}"
          @click="windowTab = 'style'"
        />
        <UiItem
          :text="i18n.t('CmsStoryBuilder.Code')"
          icon="mdi:gesture-tap"
          class="CmsStoryBuilder__tabItem"
          :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'events'}"
          @click="windowTab = 'code'"
        />
        <!-- <UiItem
        :text="i18n.t('CmsStoryBuilder.Languages')"
        icon="mdi:translate"
        class="CmsStoryBuilder__tabItem"
        :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'i18n'}"
        @click="windowTab = 'i18n'"
      /> -->
        <UiItem
          v-if="settings?.allowSource"
          :text="i18n.t('CmsStoryBuilder.Source')"
          icon="mdi:code-json"
          class="CmsStoryBuilder__tabItem"
          :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'source'}"
          @click="windowTab = 'source'"
        />
      </div>

      <!-- PREVIEW SUBTABS-->
      <div
        v-else-if="currentTab == 'preview'"
        class="CmsStoryBuilder__tabOptions"
      >
        <UiItem
          class="CmsStoryBuilder__tabItem CmsStoryBuilder__tabItem--sitemap"
          :class="{'CmsStoryBuilder__tabItem--sitemap-open': isSitemapOpen}"
          @click="isSitemapOpen = !isSitemapOpen"
          @click-actions="isSitemapOpen = !isSitemapOpen"
        >
          <template #default>
            <strong>#</strong><span>{{ currentPage?.hash }}</span>
          </template>
          <template #actions>
            <UiIcon :src="isSitemapOpen ? 'mdi:close' : 'mdi:menu-down'" />
          </template>
        </UiItem>

        <UiItem
          class="CmsStoryBuilder__tabItem"
          :text="i18n.t('CmsStoryBuilder.DataExplorer')"
          icon="mdi:code-json"
          @click="isModelExplorerOpen = true"
        />
      </div>
    </div>


    <div class="CmsStoryBuilder__body">
      <div>
        <StoryPageList
          v-model:current-page-id="currentPageId"
          v-model:story="innerStory"
          class="CmsStoryBuilder__sitemap"
          :class="{
            'CmsStoryBuilder__sitemap--visible': isSitemapOpen,
            'CmsStoryBuilder__sitemap--hidden': !isSitemapOpen,
          }"
          @update:story="onUpdateStory()"
          @open-editor="onOpenEditor"
        />
      </div>

      <UiContentWrapper
        :size="contentSize"
        class="CmsStoryBuilder__content"
      >
        <CmsStoryEditor
          v-if="isEditorLoaded"
          v-show="currentTab == 'editor'"
          v-model:current-page-id="currentPageId"
          v-model:story="innerStory"
          @update:story="onUpdateStory()"
        />

        <CmsStory
          v-if="currentTab == 'preview'"
          v-model:current-page-id="currentPageId"
          :model-value="props.modelValue"
          :story="innerStory"
          @update:model-value="emit('update:modelValue', $event)"
          @story-emit="emit('story-emit', $event)"
        />
      </UiContentWrapper>
    </div>

    <StoryEditorWindow
      v-model:story="innerStory"
      v-model:current-tab="windowTab"
      :current-page-id="currentPageId"
      @accept="onWindowAccept"
      @cancel="onWindowCancel"
    />

    <!-- current block window -->
    <BlockWindow
      v-if="editingBlock"
      v-model:action-id="currentActionId"
      v-model:block="editingBlock.innerBlock.value"
      open
      @accept="editingBlock.updateBlock($event); closeBlockWindow()"
      @cancel="editingBlock?.cancel?.(); closeBlockWindow()"
    />

    <!-- modelValue explorer -->
    <UiWindow
      v-model:open="isModelExplorerOpen"
      name="phi"
    >
      <template #header>
        <UiItem
          :text="i18n.t('CmsStoryBuilder.DataExplorer')"
          icon="mdi:code-json"
        />
      </template>
      <template #default>
        <UiInput
          v-if="isModelExplorerOpen"
          type="json"
          :model-value="props.modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </template>
    </UiWindow>
  </div>
</template>