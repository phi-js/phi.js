<script setup>
import { ref, watch, watchEffect, provide } from 'vue'

import { sanitizeStory, useStylesheets } from '../../functions'
import { CmsBlockEditor } from '../CmsBlockEditor'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: null,
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:story', 'update:currentPageId'])

// Sanitize incoming story
const sanitizedStory = ref(null)
watch(
  () => props.story,
  (incomingStory) => {
    // sanitizedStory.value = JSON.parse(JSON.stringify(sanitizeStory(incomingStory)))
    sanitizedStory.value = sanitizeStory(incomingStory)
  },
  {
    immediate: true,
    // deep: true, // causes loop (!)
  },
)


// MediaLink calls injectedStory.goTo()
// So for MediaLink to work inside a story editor, we must provide a $_cms_story.goTo()
const providedStory = {
  goTo: (pageId) => {
    emit('update:currentPageId', pageId)
  },

  goNext: () => {
    const currentIndex = sanitizedStory.value.pages.findIndex((p) => p.id == props.currentPageId)
    const nextId = sanitizedStory.value.pages?.[currentIndex + 1]?.id
    if (nextId) {
      transitionDirection.value = 'fw'
      emit('update:currentPageId', nextId)
    }
  },

  goBack: () => {
    const currentIndex = sanitizedStory.value.pages.findIndex((p) => p.id == props.currentPageId)
    const prevId = sanitizedStory.value.pages?.[currentIndex - 1]?.id
    if (prevId) {
      transitionDirection.value = 'bw'
      emit('update:currentPageId', prevId)
    }
  },
}

provide('$_cms_story', providedStory)


const currentPage = ref()
watchEffect(() => {
  const foundPage = sanitizedStory.value.pages.find((p) => p.id == props.currentPageId)
  currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
  currentPage.value.slots = {
    ...currentPage.value.slots,
    header: sanitizedStory.value.header,
    footer: sanitizedStory.value.footer,
  }
})

function onUpdateCurrentPage() {
  const targetValue = currentPage.value

  if (targetValue.slots.header) {
    sanitizedStory.value.header = targetValue.slots.header
    delete targetValue.slots.header
  }
  if (targetValue.slots.footer) {
    sanitizedStory.value.footer = targetValue.slots.footer
    delete targetValue.slots.footer
  }

  emit('update:story', {
    ...sanitizedStory.value,
    pages: sanitizedStory.value.pages.map((page) => page.id == targetValue.id ? { ...targetValue } : page),
  })
}

const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw

// STYLESHEETS
watchEffect(() => useStylesheets(sanitizedStory.value.stylesheets))

function onFormSubmit($event) {
  let data = new FormData($event.target)
  if ($event.submitter) {
    data.append($event.submitter.name, $event.submitter.value)
  }
  let goTo = data.get('story-goto')
  switch (goTo) {
  case '':
  case 0:
  case null:
  case undefined:
    /// zzzz
    break
  case 'next':
    providedStory?.goNext?.()
    break
  case 'back':
    providedStory?.goBack?.()
    break
  default:
    providedStory?.goTo?.(goTo)
    break
  }
}

const isAnimating = ref(false)
</script>

<template>
  <div class="CmsStoryEditor">
    <div
      class="CmsStoryEditor__viewport"
      :class="{'CmsStoryEditor__viewport--animating': isAnimating}"
    >
      <Transition
        :name="`${transitionName}--${transitionDirection}`"
        @before-enter="isAnimating = true"
        @after-leave="isAnimating = false"
      >
        <KeepAlive>
          <CmsBlockEditor
            v-if="currentPage?.id"
            :key="currentPage?.id"
            v-model:block="currentPage"
            class="CmsStory__page"
            @update:block="onUpdateCurrentPage"
            @submit="onFormSubmit"
          />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.CmsStoryEditor {
  --cms-story-transition-duration: var(--ui-duration-quick);
  @import "../CmsStory/transitions.scss";

  &__viewport {
    position: relative;
    height: 100%;

    &--animating {
      overflow: hidden;
    }
  }
}
</style>