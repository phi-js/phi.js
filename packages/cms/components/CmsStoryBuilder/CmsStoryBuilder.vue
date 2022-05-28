<script setup>
import { provide, ref, watchEffect, computed } from 'vue'
import { CmsStory } from '../CmsStory'
import { CmsStoryEditor } from '../CmsStoryEditor'
import { CmsStoryGraph } from '../CmsStoryGraph'
import StoryEditorWindow from '../CmsStoryEditor/StoryEditorWindow.vue'

import { useI18n } from '../../../i18n'
import {
  UiTabs,
  UiTab,
  UiItem,
  UiDialog,
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
    default: 'preview', // editor | preview
  },
})

const emit = defineEmits(['update:story', 'update:modelValue'])

const i18n = useI18n({
  en: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Styles': 'Styles',
    'CmsStoryBuilder.Events': 'Events',
    'CmsStoryBuilder.Languages': 'Languages',
    'CmsStoryBuilder.Source': 'Source',
    'CmsStoryBuilder.Preview': 'Preview',
    'CmsStoryBuilder.DataExplorer': 'Data',
    'CmsStoryBuilder.Undo': 'Undo',
    'CmsStoryBuilder.Redo': 'Redo',
    'CmsStoryBuilder.hideToolbar': 'Close editor',
  },
  es: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Styles': 'Estilos',
    'CmsStoryBuilder.Events': 'Eventos',
    'CmsStoryBuilder.Languages': 'Idiomas',
    'CmsStoryBuilder.Source': 'Fuente',
    'CmsStoryBuilder.Preview': 'Vista previa',
    'CmsStoryBuilder.DataExplorer': 'Datos',
    'CmsStoryBuilder.Undo': 'Deshacer',
    'CmsStoryBuilder.Redo': 'Rehacer',
    'CmsStoryBuilder.hideToolbar': 'Cerrar editor',
  },
})

// inner story value
const innerStory = ref()
watchEffect(() => {
  innerStory.value = JSON.parse(JSON.stringify(props.story))
})

const currentPageId = ref(props.story?.pages?.[0]?.id)
const currentPage = computed(() => {
  if (!innerStory.value?.pages?.length) {
    return null
  }

  const foundPage = innerStory.value.pages.find((p) => p.id == currentPageId.value)
  return foundPage || innerStory.value.pages[0]
})

const currentTab = ref(props.tab)
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


// Propvide global object to be used in child editor components
// e.g. BlockCssClasses, NavigationPagePicker
provide('$_cms_story_builder', {
  story: innerStory,
  accept: onWindowAccept,
  cancel: onWindowCancel,
})


// undo/redo functionality
const { push, undo, redo, hasUndo, hasRedo } = useUndo(innerStory.value, (newValue) => {
  innerStory.value = newValue
  emit('update:story', { ...innerStory.value })
})

const isModelExplorerOpen = ref(false)

const contentSize = ref({
  width: null,
  height: null,
})


// expanded/collapsed
const isCollapsed = ref(true)
const isEditorLoaded = ref(false)

function toggleCollapsed() {
  isCollapsed.value = !isCollapsed.value
  if (!isCollapsed.value) {
    currentTab.value = 'editor'
  } else {
    currentTab.value = 'preview'
  }

  if (currentTab.value == 'editor') {
    isEditorLoaded.value = true
  }
}
</script>

<template>
  <div
    class="CmsStoryBuilder"
    :class="{ 'CmsStoryBuilder--collapsed': isCollapsed }"
  >
    <div class="CmsStoryBuilder__toggler">
      <slot name="header" />

      <UiItem
        :text="i18n.t('CmsStoryBuilder.Editor')"
        icon="mdi:pencil"
        @click="toggleCollapsed()"
      />
    </div>

    <UiTabs
      v-model="currentTab"
      class="CmsStoryBuilder__header"
    >
      <template #left>
        <UiIcon
          class="CmsStoryBuilder__controlItem"
          src="mdi:arrow-collapse"
          :title="i18n.t('CmsStoryBuilder.hideToolbar')"
          style="width: 40px"
          @click="toggleCollapsed()"
        />

        <slot name="header" />
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
          />

          <!-- <UiIcon
            class="CmsStoryBuilder__controlItem"
            src="mdi:arrow-collapse"
            :title="i18n.t('CmsStoryBuilder.hideToolbar')"
            style="width: 40px"
            @click="toggleCollapsed()"
          /> -->
        </div>
      </template>

      <UiTab
        :text="i18n.t('CmsStoryBuilder.Editor')"
        value="editor"
      >
        <!-- EDITOR SUBTABS-->
        <div class="CmsStoryBuilder__tabOptions">
          <UiItem
            class="CmsStoryBuilder__tabItem CmsStoryBuilder__tabItem--sitemap"
            @click="isSitemapOpen = !isSitemapOpen"
            @click-actions="isSitemapOpen = !isSitemapOpen"
          >
            <template #default>
              <strong>#</strong><span>{{ currentPage?.info?.text }}</span>
            </template>
            <template #actions>
              <UiIcon src="mdi:menu-down" />
            </template>
          </UiItem>

          <UiItem
            class="CmsStoryBuilder__tabItem"
            :text="i18n.t('CmsStoryBuilder.Styles')"
            icon="mdi:palette-advanced"
            :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'style'}"
            @click="windowTab = 'style'"
          />
          <UiItem
            :text="i18n.t('CmsStoryBuilder.Events')"
            icon="mdi:gesture-tap"
            class="CmsStoryBuilder__tabItem"
            :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'events'}"
            @click="windowTab = 'events'"
          />
          <UiItem
            :text="i18n.t('CmsStoryBuilder.Languages')"
            icon="mdi:translate"
            class="CmsStoryBuilder__tabItem"
            :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'i18n'}"
            @click="windowTab = 'i18n'"
          />
          <UiItem
            :text="i18n.t('CmsStoryBuilder.Source')"
            icon="mdi:code-json"
            class="CmsStoryBuilder__tabItem"
            :class="{'CmsStoryBuilder__tabItem--active': windowTab == 'source'}"
            @click="windowTab = 'source'"
          />

          <slot name="corner" />
        </div>
      </UiTab>

      <UiTab
        :text="i18n.t('CmsStoryBuilder.Preview')"
        value="preview"
      >
        <!-- PREVIEW SUBTABS-->
        <div class="CmsStoryBuilder__tabOptions">
          <UiItem
            class="CmsStoryBuilder__tabItem CmsStoryBuilder__tabItem--sitemap"
            @click="isSitemapOpen = !isSitemapOpen"
            @click-actions="isSitemapOpen = !isSitemapOpen"
          >
            <template #default>
              <strong>#</strong><span>{{ currentPage?.info?.text }}</span>
            </template>
            <template #actions>
              <UiIcon src="mdi:menu-down" />
            </template>
          </UiItem>

          <UiItem
            class="CmsStoryBuilder__tabItem"
            :text="i18n.t('CmsStoryBuilder.DataExplorer')"
            icon="mdi:code-json"
            @click="isModelExplorerOpen = true"
          />

          <slot name="corner" />
        </div>
      </UiTab>
    </UiTabs>

    <div class="CmsStoryBuilder__body">
      <UiContentWrapper v-bind="contentSize">
        <CmsStoryEditor
          v-if="isEditorLoaded"
          v-show="currentTab == 'editor'"
          v-model:current-page-id="currentPageId"
          v-model:story="innerStory"
          @update:story="onUpdateStory()"
        />

        <CmsStory
          v-if="currentTab != 'editor'"
          v-model:current-page-id="currentPageId"
          :model-value="props.modelValue"
          :story="innerStory"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </UiContentWrapper>

      <UiDialog
        v-slot="{ close }"
        v-model:open="isSitemapOpen"
      >
        <div class="CmsStoryBuilder__sitemap">
          <CmsStoryGraph
            v-model:current-page-id="currentPageId"
            v-model:story="innerStory"
            @update:current-page-id="currentPageId = $event; close()"
            @update:story="onUpdateStory()"
          />
        </div>
      </UiDialog>

      <StoryEditorWindow
        v-model:story="innerStory"
        v-model:current-tab="windowTab"
        :current-page-id="currentPageId"
        @accept="onWindowAccept"
        @cancel="onWindowCancel"
      />

      <!-- modelValue explorer -->
      <UiWindow
        v-model:open="isModelExplorerOpen"
        name="phi"
        class="CmsStoryBuilder__controls"
      >
        <template #header>
          <UiItem
            :text="i18n.t('CmsStoryBuilder.DataExplorer')"
            icon="mdi:code-json"
          />
        </template>
        <template #default>
          <UiInput
            type="json"
            :model-value="props.modelValue"
            @update:model-value="emit('update:modelValue', $event)"
          />
        </template>
      </UiWindow>
    </div>
  </div>
</template>