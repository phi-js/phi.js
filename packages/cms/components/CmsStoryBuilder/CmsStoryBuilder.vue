<script setup>
import { provide, ref, computed, watch, shallowRef, onMounted, onUnmounted } from 'vue'
import { useI18n } from '@/packages/i18n'

import { CmsStory } from '../CmsStory'
import CmsStoryEditor from '../CmsStoryEditor/CmsStoryEditor.vue'
import StoryEditorWindow from '../CmsStoryEditor/StoryEditorWindow.vue'
import BlockWindow from '../CmsBlockEditor/BlockWindow.vue'
import StoryPageManager from './StoryPageManager.vue'
import CmsTemplatePicker from '../CmsTemplatePicker/CmsTemplatePicker.vue'
import promptImportFont from './promptImportFont.js'

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

import { getPluginData, useStorySettings } from '../../functions'

const pluginData = getPluginData()
const storySettings = useStorySettings()

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

  /*
  An array of "fields" (A bastardization of a Schema object)
  describing the fields in modelValue.
  e.g.
  modelValue: {
    person: {
      firstname: 'foo',
      lastname: 'foo',
    },
    picked: 'a'
  }

  modelFields: [
    {
      value: 'person.firstname',
      text: 'Nombre de la persona'
    },
    {
      value: 'picked',
      enum: [
        {value: 'a', 'Option A'},
        {value: 'b', 'Option B'},
      ]
    }
  ]
  */
  modelFields: {
    type: Array,
    required: false,
    default: () => [],
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
    'CmsStoryBuilder.Graph': 'Sitemap',
    'CmsStoryBuilder.Style': 'Style',
    'CmsStoryBuilder.Code': 'Code',
    'CmsStoryBuilder.Languages': 'Languages',
    'CmsStoryBuilder.Source': 'Source',
    'CmsStoryBuilder.Preview': 'Preview',
    'CmsStoryBuilder.DataExplorer': 'Variables',
    'CmsStoryBuilder.Undo': 'Undo',
    'CmsStoryBuilder.Redo': 'Redo',
    'CmsStoryBuilder.hideToolbar': 'Close editor',
    'CmsStoryBuilder.Run': 'Run',
    'CmsStoryBuilder.Stop': 'Stop',
  },
  es: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Graph': 'Mapa del sitio',
    'CmsStoryBuilder.Style': 'Estilo',
    'CmsStoryBuilder.Code': 'Código',
    'CmsStoryBuilder.Languages': 'Idiomas',
    'CmsStoryBuilder.Source': 'Fuente',
    'CmsStoryBuilder.Preview': 'Vista previa',
    'CmsStoryBuilder.DataExplorer': 'Variables',
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


/* CSS Editor settings */
provide('_ui_CssEditor_uploadsEnpoint', storySettings?.uploads?.assets)
provide('_ui_CssEditor_availableFonts', computed(() => innerStory.value.fonts))
provide('_ui_CssEditor_createFont', async () => {
  const googleFont = await promptImportFont()
  if (!googleFont) {
    return
  }

  if (!Array.isArray(innerStory.value.fonts)) {
    innerStory.value.fonts = []
  }

  if (!innerStory.value.fonts.find((fnt) => fnt.id === googleFont.id)) {
    innerStory.value.fonts.push(googleFont)
    onUpdateStory()
  }

  return googleFont.fontFamily
})


/* Current Page */
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
// Within available actions, shows a tab called "VmExpression.functions.title"

provide('$_vm_functions', computed(() => {
  if (!innerStory.value.methods?.length) {
    return []
  }
  return [{
    name: 'story',
    title: 'Story methods',
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

const refHeader = ref()

// CTRL+Space to toggle between editor and preview tabs
function onKeyDown(event) {
  if (event.code == 'Space' && event.ctrlKey) {
    isRunning.value = !isRunning.value
  }
}

const storyBuilderStyle = ref({ '--cms-builder-header-bottom': '0px' })

function onScroll() {
  const rect = refHeader.value.getBoundingClientRect()
  storyBuilderStyle.value['--cms-builder-header-bottom'] = `${rect.bottom}px`
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('scroll', onScroll)

  setTimeout(() => {
    if (!refHeader.value) {
      return
    }
    const rect = refHeader.value.getBoundingClientRect()
    storyBuilderStyle.value['--cms-builder-header-bottom'] = `${rect.bottom}px`
  }, 80)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
  document.removeEventListener('scroll', onScroll)
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



const storyFields = computed(() => {
  return i18n.obj([
    ...(props.modelFields || []),
    ...getStoryFields(innerStory.value),
  ])
})

provide('$_vm_fields', storyFields)


// undo/redo functionality
const { push, undo, redo, hasUndo, hasRedo } = useUndo(innerStory.value, (newValue) => {
  innerStory.value = newValue
  emit('update:story', { ...innerStory.value })
})

const isModelExplorerOpen = ref(false)

const isEmpty = computed(() => !innerStory.value.pages?.length)

function onTemplatePickerInput($event) {
  innerStory.value = {
    ...$event,
    id: innerStory.value.id,
    title: innerStory.value.title || $event.title,
    subtext: undefined,
  }
  onUpdateStory()
}
</script>

<template>
  <div
    class="CmsStoryBuilder"
    :class="{'CmsStoryBuilder--empty': isEmpty}"
    :style="storyBuilderStyle"
  >
    <div
      ref="refHeader"
      class="CmsStoryBuilder__header"
    >
      <div class="CmsStoryBuilder__headerStory">
        <slot name="header" />

        <!-- Run / Stop button -->
        <UiItem
          class="CmsStoryBuilder__clickable CmsStoryBuilder__runButton"
          :class="{'CmsStoryBuilder__runButton--running': isRunning}"
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

      <div
        v-if="!isEmpty"
        class="CmsStoryBuilder__headerPage"
      >
        <!-- Page picker and current page dropdown menu -->
        <StoryPageManager
          v-model:current-page-id="currentPageId"
          v-model:story="innerStory"
          @update:story="onUpdateStory()"
        >
          <template #buttons>
            <UiIcon
              class="BlockScaffold__button"
              :title="i18n.t('CmsStoryBuilder.Graph')"
              src="mdi:sitemap"
              @click="windowTab = 'graph'"
            />
          </template>
        </StoryPageManager>

        <div
          id="omg-testing"
          style="flex:1"
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

    <CmsTemplatePicker
      v-if="isEmpty"
      @input="onTemplatePickerInput"
    />

    <template v-else>
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
        v-model:current-page-id="currentPageId"
        @accept="onWindowAccept"
        @cancel="onWindowCancel"
      />

      <!-- current block window -->
      <BlockWindow
        v-if="editingBlock"
        v-model:action-id="currentActionId"
        v-model:block="editingBlock.innerBlock.value"
        class="CmsStoryBuilder__blockWindow"
        open
        @accept="editingBlock.updateBlock($event); closeBlockWindow()"
        @cancel="editingBlock?.cancel?.(); closeBlockWindow()"
      />

      <!-- modelValue explorer -->
      <UiWindow
        v-model:open="isModelExplorerOpen"
        name="phi"
        class="CmsStoryBuilder__modelValue BlockWindow"
      >
        <template #header>
          <UiItem
            :text="i18n.t('CmsStoryBuilder.DataExplorer')"
            icon="mdi:code-json"
            class="BlockWindow__headerItem"
          />
        </template>

        <template #limbo>
          <Component
            :is="pluginData.getSlotComponent('StoryModelValue')"
            :model-value="props.modelValue"
            @update:model-value="emit('update:modelValue', $event)"
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
    </template>
  </div>
</template>