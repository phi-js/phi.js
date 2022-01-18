<script setup>
import { ref, watch } from 'vue'
import { CmsBlockEditor } from '../CmsBlockEditor'
import LayoutPageWindow from '../../plugins/layout/components/LayoutPage/LayoutPageWindow.vue'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: () => ({}),
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

const currentPage = ref()
watch(
  () => props.currentPageId,
  (newValue) => {
    const pages = Array.isArray(props.story?.pages) ? props.story.pages : []
    const foundPage = pages.find((p) => p.id == newValue)
    currentPage.value = foundPage ? JSON.parse(JSON.stringify(foundPage)) : null
  },
  { immediate: true },
)

function emitUpdate() {
  const pages = Array.isArray(props.story?.pages) ? props.story.pages : []
  emit('update:story', {
    ...props.story,
    pages: pages.map((page) => page.id == props.currentPageId ? { ...currentPage.value } : page),
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
      v-model:block="currentPage"
      :open="isSettingsOpen"
      @update:open="emit('update:isSettingsOpen', $event)"
      @accept="emitUpdate"
      @cancel="windowOnCancel"
    />
  </div>
</template>