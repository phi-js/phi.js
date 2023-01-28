<script setup>
import { provide, ref, computed, watch, shallowRef, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/packages/i18n'

import { CmsStory } from '../CmsStory'
import CmsStoryEditor from '../CmsStoryEditor/CmsStoryEditor.vue'
import StoryEditorWindow from '../CmsStoryEditor/StoryEditorWindow.vue'
import BlockWindow from '../CmsBlockEditor/BlockWindow.vue'
import StoryPageManager from './StoryPageManager.vue'

import { getStoryFields, sanitizeStory } from '../../functions'

import {
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
    'CmsStoryBuilder.DataExplorer': 'Data',
    'CmsStoryBuilder.Undo': 'Undo',
    'CmsStoryBuilder.Redo': 'Redo',
    'CmsStoryBuilder.hideToolbar': 'Close editor',
    'CmsStoryBuilder.Run': 'Run',
    'CmsStoryBuilder.Stop': 'Stop',
  },
  es: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Style': 'Estilo',
    'CmsStoryBuilder.Code': 'Código',
    'CmsStoryBuilder.Languages': 'Idiomas',
    'CmsStoryBuilder.Source': 'Fuente',
    'CmsStoryBuilder.Preview': 'Vista previa',
    'CmsStoryBuilder.DataExplorer': 'Datos',
    'CmsStoryBuilder.Undo': 'Deshacer',
    'CmsStoryBuilder.Redo': 'Rehacer',
    'CmsStoryBuilder.hideToolbar': 'Cerrar editor',
    'CmsStoryBuilder.Run': 'Ejecutar',
    'CmsStoryBuilder.Stop': 'Detener',
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

const isRunning = ref(false)

// CTRL+Space to toggle between editor and preview tabs
function onKeyDown(event) {
  if (event.code == 'Space' && event.ctrlKey) {
    isRunning.value = !isRunning.value
  }
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})


const windowTab = ref()

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




const storyFields = computed(() => getStoryFields(innerStory.value))
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
      <div class="CmsStoryBuilder__headerStory">
        <slot name="header" />

        <!-- Run / Stop button -->
        <UiItem
          class="CmsStoryBuilder__clickable CmsStoryBuilder__runButton"
          :text="!isRunning ? i18n.t('CmsStoryBuilder.Run') : i18n.t('CmsStoryBuilder.Stop')"
          :icon="!isRunning ? 'mdi:play' : 'mdi:stop'"
          @click="isRunning = !isRunning"
        />

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
          class="CmsStoryBuilder__tabItem"
          :text="i18n.t('CmsStoryBuilder.DataExplorer')"
          icon="mdi:code-json"
          @click="isModelExplorerOpen = true"
        />

        <UiItem
          v-if="settings?.allowSource"
          :text="i18n.t('CmsStoryBuilder.Source')"
          icon="mdi:code-json"
          class="CmsStoryBuilder__tabItem"
          :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'source'}"
          @click="windowTab = 'source'"
        />

        <slot name="corner" />
      </div>

      <div class="CmsStoryBuilder__headerPage">
        <!-- sitemap button -->
        <StoryPageManager
          v-model:current-page-id="currentPageId"
          v-model:story="innerStory"
          @update:story="onUpdateStory()"
          @open-editor="onOpenEditor"
        />


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
      </div>
    </div>

    <UiContentWrapper
      :size="contentSize"
      class="CmsStoryBuilder__body"
    >
      <CmsStoryEditor
        v-show="!isRunning"
        v-model:current-page-id="currentPageId"
        v-model:story="innerStory"
        @update:story="onUpdateStory()"
      />

      <CmsStory
        v-if="isRunning"
        v-model:current-page-id="currentPageId"
        :model-value="props.modelValue"
        :story="innerStory"
        @update:model-value="emit('update:modelValue', $event)"
        @story-emit="emit('story-emit', $event)"
      />
    </UiContentWrapper>

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