<script setup>
import { provide, ref, watchEffect, computed } from 'vue'
import { CmsStory } from '../CmsStory'
import { CmsStoryEditor } from '../CmsStoryEditor'
import { CmsStoryGraph } from '../CmsStoryGraph'
import StoryEditorWindow from '../CmsStoryEditor/StoryEditorWindow.vue'

import { useI18n } from '../../../i18n'
import { UiTabs, UiTab, UiItem, UiDrawer, UiIcon, UiWindow, UiInput } from '@/packages/ui'
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

  settings: {
    type: Object,
    required: false,
    default: null,
  },

  allowSource: {
    type: Boolean,
    required: false,
    // default: false,
    default: true,
  },
})

const emit = defineEmits(['update:story', 'update:modelValue'])

const i18n = useI18n({
  en: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Styles': 'Styles',
    'CmsStoryBuilder.Events': 'Events',
    'CmsStoryBuilder.Dictionary': 'Dictionary',
    'CmsStoryBuilder.Source': 'Source',
    'CmsStoryBuilder.Preview': 'Preview',
    'CmsStoryBuilder.DataExplorer': 'DataExplorer',
  },
  es: {
    'CmsStoryBuilder.Editor': 'Editor',
    'CmsStoryBuilder.Styles': 'Estilos',
    'CmsStoryBuilder.Events': 'Eventos',
    'CmsStoryBuilder.Dictionary': 'Diccionario',
    'CmsStoryBuilder.Source': 'Fuente',
    'CmsStoryBuilder.Preview': 'Vista previa',
    'CmsStoryBuilder.DataExplorer': 'Explorar datos',
  },
})

// inner story value
const innerStory = ref()
// watchEffect(() => innerStory.value = { ...props.story })
watchEffect(() => innerStory.value = JSON.parse(JSON.stringify(props.story)))

const currentPageId = ref(props.story.pages[0].id)
const currentPage = computed(() => {
  const foundPage = innerStory.value.pages.find((p) => p.id == currentPageId.value)
  return foundPage || innerStory.value.pages[0]
})

const currentTab = ref('editor')
const settingsTab = ref()
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
</script>

<template>
  <div class="CmsStoryBuilder">
    <UiTabs
      v-model="currentTab"
      class="CmsStoryBuilder__header"
    >
      <template #right>
        <div class="CmsStoryBuilder__controls">
          <UiIcon
            src="mdi:arrow-u-left-top"
            :title="'Undo'"
            class="ui--clickable"
            :disabled="!hasUndo"
            @click="undo()"
          />
          <UiIcon
            src="mdi:arrow-u-right-top"
            :title="'Redo'"
            class="ui--clickable"
            :disabled="!hasRedo"
            @click="redo()"
          />
        </div>
      </template>

      <UiTab
        :text="i18n.t('CmsStoryBuilder.Editor')"
        value="editor"
      >
        <!-- EDITOR SUBTABS-->
        <div class="UiRow">
          <UiItem
            class="ui--clickable"
            icon="mdi:pound"
            :text="currentPage.info?.text"
            @click="isSitemapOpen = !isSitemapOpen"
            @click-actions="isSitemapOpen = !isSitemapOpen"
          >
            <template #actions>
              <UiIcon :src="isSitemapOpen ? 'mdi:menu-down' : 'mdi:menu-right'" />
            </template>
          </UiItem>

          <UiItem
            :text="i18n.t('CmsStoryBuilder.Styles')"
            icon="mdi:palette-advanced"
            class="ui--clickable"
            :class="{'--active': settingsTab == 'style'}"
            @click="settingsTab = 'style'"
          />
          <UiItem
            :text="i18n.t('CmsStoryBuilder.Events')"
            icon="mdi:gesture-tap"
            class="ui--clickable"
            :class="{'--active': settingsTab == 'events'}"
            @click="settingsTab = 'events'"
          />
          <UiItem
            :text="i18n.t('CmsStoryBuilder.Dictionary')"
            icon="mdi:translate"
            class="ui--clickable"
            :class="{'--active': settingsTab == 'i18n'}"
            @click="settingsTab = 'i18n'"
          />
          <UiItem
            v-if="props.allowSource"
            :text="i18n.t('CmsStoryBuilder.Source')"
            icon="mdi:code-json"
            class="ui--clickable"
            :class="{'--active': settingsTab == 'source'}"
            @click="settingsTab = 'source'"
          />

          <slot name="corner" />
        </div>
      </UiTab>

      <UiTab
        :text="i18n.t('CmsStoryBuilder.Preview')"
        value="preview"
      >
        <!-- PREVIEW SUBTABS-->
        <div class="UiRow">
          <UiItem
            class="ui--clickable"
            icon="mdi:pound"
            :text="currentPage.info?.text"
            @click="isSitemapOpen = !isSitemapOpen"
            @click-actions="isSitemapOpen = !isSitemapOpen"
          >
            <template #actions>
              <UiIcon :src="isSitemapOpen ? 'mdi:menu-down' : 'mdi:menu-right'" />
            </template>
          </UiItem>

          <UiItem
            class="ui--clickable"
            :text="i18n.t('CmsStoryBuilder.DataExplorer')"
            icon="mdi:code-json"
            @click="isModelExplorerOpen = true"
          />

          <slot name="corner" />
        </div>
      </UiTab>
    </UiTabs>

    <div class="CmsStoryBuilder__body">
      <UiDrawer
        v-slot="{ close }"
        v-model:open="isSitemapOpen"
        class="CmsStoryBuilder__drawer"
      >
        <div class="CmsStoryBuilder__sitemap">
          <CmsStoryGraph
            v-model:current-page-id="currentPageId"
            v-model:story="innerStory"
            @update:current-page-id="currentPageId = $event; close()"
            @update:story="onUpdateStory()"
          />
        </div>
      </UiDrawer>

      <StoryEditorWindow
        v-model:story="innerStory"
        v-model:current-tab="settingsTab"
        :current-page-id="currentPageId"
        :allow-source="allowSource"
        @accept="onWindowAccept"
        @cancel="onWindowCancel"
      />

      <CmsStoryEditor
        v-show="currentTab == 'editor'"
        v-model:current-page-id="currentPageId"
        v-model:story="innerStory"
        :settings="props.settings"
        @update:story="onUpdateStory()"
      />

      <CmsStory
        v-if="currentTab != 'editor'"
        v-model:current-page-id="currentPageId"
        :model-value="props.modelValue"
        :story="props.story"
        :settings="props.settings"
        @update:model-value="emit('update:modelValue', $event)"
      />

      <!-- modelValue explorer -->
      <UiWindow
        v-model:open="isModelExplorerOpen"
        name="phi"
        class="StoryEditor__modelWindow"
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

<style lang="scss">
.CmsStoryBuilder {
  &__body {
    position: relative;
  }

  &__drawer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;

    .UiDrawer__contents {
      position: relative;
      top: -24px;
    }
  }

  &__sitemap {
    background: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    margin: 12px;
    margin-top: 0;
    border-radius: 5px;
  }

  &__controls {
    .UiIcon {
      width: 40px;
      height: 40px;

      &[disabled=true] {
        opacity: 0.5;
      }
    }
  }

  &__notice {
    margin-left: auto;
    font-size: 12px;
    display: flex;
    align-items: center;
    padding: 4px 12px;
    color: #aaa;
  }

  .UiRow {
    display: flex;
    // align-items: flex-start;
    align-items: stretch;
    // align-items: center;

    .UiItem {
      --ui-item-padding: 6px 12px;
      font-size: 14px;
    }
  }
}


/* Dark */
.CmsStoryBuilder {
  &__header {
    border-radius: 5px;
    background-color: #313131;
    color: #f0f0f0;
    margin-bottom: 20px;

    .UiRow {
      // height: 51px;
      background-color: rgba(255, 255, 255, 0.04);

      & > :first-child {
        border-right: 1px solid #444;
      }
    }

    .ui--clickable {
      user-select: none;

      &:hover {
        background-color: rgba(255, 255, 255, 0.08) !important;
      }
    }
  }
}
</style>