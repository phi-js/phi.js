<script setup>
import { provide, ref, watchEffect, computed, watch, useSlots } from 'vue'
import { CmsStory } from '../CmsStory'
import { CmsStoryEditor } from '../CmsStoryEditor'
import StoryPageList from './StoryPageList.vue'
import StoryEditorWindow from '../CmsStoryEditor/StoryEditorWindow.vue'
import { getStorySchema } from '../../functions'

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
    default: 'preview', // editor | preview
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

const currentPageId = ref()
watch(
  () => props.currentPageId,
  (newPageId) => currentPageId.value = newPageId,
  { immediate: true },
)

function updatePageId($event) {
  /*
  Vue bug(?)  Combining
  v-model:current-page-id="currentPageId"
  @update:current-page-id="updatePageId($event)"

  will NOT TRIGGER the v-model update on the variable.
  So, do it here :(


  Note: It works when NOT using dashes in the prop names, i.e:
  v-model:currentPageId="currentPageId"
  @update:currentPageId="updatePageId($event)"
  */
  if (currentPageId.value != $event) {
    currentPageId.value = $event
  }
  emit('update:currentPageId', currentPageId.value)
}


// inner story value
const innerStory = ref()
watchEffect(() => {
  innerStory.value = JSON.parse(JSON.stringify(props.story))

  if (!currentPageId.value) {
    currentPageId.value = props.story?.pages?.[0]?.id
    updatePageId(currentPageId.value)
  }
})

// Used by VmExpressionPicker
provide('$_vm_functions', computed(() => {
  if (!innerStory.value.methods?.length) {
    return []
  }
  return [{
    title: 'Functions',
    children: innerStory.value.methods
      .map((storyMethod) => ({
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

/* Provide VM schema */
const storySchema = computed(() => {
  const storySchema = getStorySchema(innerStory.value)

  if (!storySchema.properties?.$i18n) {
    storySchema.properties.$i18n = {
      type: 'object',
      properties: {
        locale: {
          type: 'string',
          title: 'Language',
          enum: [
            { value: 'en' },
            { value: 'es' },
            { value: 'fr' },
            { value: 'de' },
          ],
        },
      },
    }
  }

  return storySchema
})

provide('$_vm_modelSchema', storySchema)



// undo/redo functionality
const { push, undo, redo, hasUndo, hasRedo } = useUndo(innerStory.value, (newValue) => {
  innerStory.value = newValue
  emit('update:story', { ...innerStory.value })
})

const isModelExplorerOpen = ref(false)

const slots = useSlots()
const contentSlot = computed(() => {
  return slots?.[`contents-${currentTab.value}`]
})
</script>

<template>
  <div class="CmsStoryBuilder">
    <div class="CmsStoryBuilder__toolbar">
      <UiTabs
        v-model="currentTab"
        @update:model-value="emit('update:tab', $event)"
      >
        <template #left>
          <slot name="header" />
        </template>

        <template #right>
          <div
            class="CmsStoryBuilder__controls"
            :class="{'CmsStoryBuilder__controls--hidden': !!contentSlot}"
          >
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
          </div>
          <slot name="right" />
        </template>

        <UiTab
          :text="i18n.t('CmsStoryBuilder.Editor')"
          value="editor"
        >
          <!-- EDITOR SUBTABS-->
          <div class="CmsStoryBuilder__tabOptions">
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

            <slot name="preview-options" />
            <slot name="corner" />
          </div>
        </UiTab>
        <slot name="default" />
      </UiTabs>
    </div>


    <div
      v-if="contentSlot"
      class="CmsStoryBuilder__body"
    >
      <div class="CmsStoryBuilder__content">
        <Component :is="contentSlot" />
      </div>
    </div>
    <div
      v-if="!contentSlot"
      class="CmsStoryBuilder__body"
    >
      <div
        class="CmsStoryBuilder__sidebar"
        :class="{
          'CmsStoryBuilder__sidebar--visible': isSitemapOpen,
          'CmsStoryBuilder__sidebar--hidden': !isSitemapOpen,
        }"
      >
        <StoryPageList
          v-model:current-page-id="currentPageId"
          v-model:story="innerStory"
          class="CmsStoryBuilder__pageList"
          @update:current-page-id="updatePageId($event)"
          @update:story="onUpdateStory()"
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
          @update:current-page-id="updatePageId($event)"
          @update:story="onUpdateStory()"
        />

        <CmsStory
          v-if="currentTab != 'editor'"
          v-model:current-page-id="currentPageId"
          :model-value="props.modelValue"
          :story="innerStory"
          @update:current-page-id="updatePageId($event)"
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