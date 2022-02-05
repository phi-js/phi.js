<script setup>
// Base story styles
import '../../style/base.scss'

// Editor and subcomponents styles
import '../../style/editor.scss'


import { ref, watch, watchEffect } from 'vue'
import { sanitizeStory } from '../../functions'
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
    type: String,
    required: false,
    default: null,
  },

  isSettingsOpen: {
    type: [Boolean, Number, String],
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:story', 'update:currentPageId', 'update:isSettingsOpen'])

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
  currentPage.value = foundPage
    ? JSON.parse(JSON.stringify(foundPage))
    : JSON.parse(JSON.stringify(sanitizedStory.value.pages?.[0]))
})


function emitUpdate() {
  emit('update:story', {
    ...sanitizedStory.value,
    pages: sanitizedStory.value.pages.map((page) => page.id == currentPage.value.id ? { ...currentPage.value } : page),
  })
}

function windowOnCancel() {
  const pages = Array.isArray(props.story?.pages) ? props.story.pages : []
  const foundPage = pages.find((p) => p.id == currentPage.value.id)
  currentPage.value = foundPage ? JSON.parse(JSON.stringify(foundPage)) : null
}

const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw
</script>

<template>
  <div class="CmsStoryEditor">
    <Transition :name="`${transitionName}--${transitionDirection}`">
      <KeepAlive>
        <CmsBlockEditor
          v-if="currentPage"
          :key="currentPage.id"
          v-model:block="currentPage"
          class="CmsStoryEditor__page"
          :settings="settings"
          @update:block="emitUpdate"
        />
      </KeepAlive>
    </Transition>

    <LayoutPageWindow
      v-if="currentPage"
      v-model:block="currentPage"
      :open="isSettingsOpen"
      @update:open="emit('update:isSettingsOpen', $event)"
      @accept="emitUpdate"
      @cancel="windowOnCancel"
    />
  </div>
</template>