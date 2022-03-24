<script setup>
// Base story styles
import '../../style/base.scss'

// Editor and subcomponents styles
import './style.scss'

import { ref, watch, watchEffect, provide, computed, defineComponent, h, Teleport } from 'vue'
import { sanitizeStory } from '../../functions'
import { CmsBlockEditor } from '../CmsBlockEditor'
import LayoutPageWindow from '../../plugins/layout/components/LayoutPage/LayoutPageWindow.vue'
import CmsStoryWindow from './CmsStoryWindow.vue'

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

  currentSettingsTab: {
    type: [Boolean, String],
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:story', 'update:currentPageId', 'update:currentSettingsTab'])

// Sanitize incoming story
const sanitizedStory = ref(null)
watch(
  () => props.story,
  // (incomingStory) => sanitizedStory.value = sanitizeStory(incomingStory),
  (incomingStory) => sanitizedStory.value = JSON.parse(JSON.stringify(sanitizeStory(incomingStory))),
  { immediate: true },
)

// Accept / Cancel
function accept() {
  emit('update:story', { ...sanitizedStory.value })
  return true
}

function cancel() {
  sanitizedStory.value = sanitizeStory(props.story)
  return true
}


const currentPage = ref()
watchEffect(() => {
  const foundPage = sanitizedStory.value.pages.find((p) => p.id == props.currentPageId)
  currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
})

function onUpdateCurrentPage() {
  emit('update:story', {
    ...sanitizedStory.value,
    pages: sanitizedStory.value.pages.map((page) => page.id == currentPage.value.id ? { ...currentPage.value } : page),
  })
}

provide('$_cms_story_editor', { story: sanitizedStory })

function onCurrentPageCancel() {
  const pages = Array.isArray(props.story?.pages) ? props.story.pages : []
  const foundPage = pages.find((p) => p.id == currentPage.value.id)
  currentPage.value = foundPage ? JSON.parse(JSON.stringify(foundPage)) : null
}

const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw

const isWindowOpen = ref(false)

const storyCSS = computed(() => sanitizedStory.value.css.classes.map((c) => c.css).join('\n'))
const StyleTag = defineComponent({
  render: () => h(
    Teleport,
    { to: 'head' },
    h(
      'style',
      {
        type: 'text/css',
        class: 'CmsStory__style',
      },
      storyCSS.value,
    ),
  ),
})
</script>

<template>
  <div class="CmsStoryEditor CmsStory">
    <StyleTag />

    <Transition :name="`${transitionName}--${transitionDirection}`">
      <div
        v-if="currentPage"
        :key="currentPage.id"
      >
        <KeepAlive>
          <CmsBlockEditor
            v-model:block="currentPage"
            class="CmsStoryEditor__page CmsStory__page"
            :settings="settings"
            @update:block="onUpdateCurrentPage"
          />
        </KeepAlive>
      </div>
    </Transition>

    <LayoutPageWindow
      v-if="currentPage"
      v-model:block="currentPage"
      :current-tab="currentSettingsTab"
      @update:currentTab="emit('update:currentSettingsTab', $event)"
      @accept="onUpdateCurrentPage"
      @cancel="onCurrentPageCancel"
    />

    <CmsStoryWindow
      v-model:open="isWindowOpen"
      v-model:story="sanitizedStory"
      @accept="accept"
      @cancel="cancel"
    />
  </div>
</template>