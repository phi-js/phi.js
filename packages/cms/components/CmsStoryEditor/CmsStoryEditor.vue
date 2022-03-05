<script setup>
// Base story styles
import '../../style/base.scss'

// Editor and subcomponents styles
import './style.scss'

import { ref, watch, watchEffect, provide } from 'vue'
import { sanitizeStory, applyStoryCss } from '../../functions'
import { CmsBlockEditor } from '../CmsBlockEditor'
import LayoutPageWindow from '../../plugins/layout/components/LayoutPage/LayoutPageWindow.vue'

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
  (incomingStory) => sanitizedStory.value = sanitizeStory(incomingStory),
  { immediate: true },
)

const currentPage = ref()
watchEffect(() => {
  const foundPage = sanitizedStory.value.pages.find((p) => p.id == props.currentPageId)
  // currentPage.value = JSON.parse(JSON.stringify(foundPage || sanitizedStory.value.pages?.[0]))
  currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
})

function emitUpdate() {
  emit('update:story', {
    ...sanitizedStory.value,
    pages: sanitizedStory.value.pages.map((page) => page.id == currentPage.value.id ? { ...currentPage.value } : page),
  })
}

provide('$_cms_story_editor', { story: sanitizedStory })

function windowOnCancel() {
  const pages = Array.isArray(props.story?.pages) ? props.story.pages : []
  const foundPage = pages.find((p) => p.id == currentPage.value.id)
  currentPage.value = foundPage ? JSON.parse(JSON.stringify(foundPage)) : null
}

const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw


// Handle <link> containing story's CSS
watchEffect(() => applyStoryCss(sanitizedStory.value))

provide('$_cms_emitDraft', (block) => {
  applyStoryCss(sanitizedStory.value, null, block)
})
</script>

<template>
  <div class="CmsStoryEditor CmsStory">
    <Transition :name="`${transitionName}--${transitionDirection}`">
      <KeepAlive>
        <CmsBlockEditor
          v-if="currentPage"
          :key="currentPage.id"
          v-model:block="currentPage"
          class="CmsStoryEditor__page CmsStory__page"
          :settings="settings"
          @update:block="emitUpdate"
        />
      </KeepAlive>
    </Transition>

    <LayoutPageWindow
      v-if="currentPage"
      v-model:block="currentPage"
      :currentTab="currentSettingsTab"
      @update:currentTab="emit('update:currentSettingsTab', $event)"
      @accept="emitUpdate"
      @cancel="windowOnCancel"
    />
  </div>
</template>