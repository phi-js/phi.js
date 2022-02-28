<script setup>
// Base story styles
import '../../style/base.scss'

import { ref, computed, watch, watchEffect, provide } from 'vue'
import CmsBlock from '../CmsBlock/CmsBlock.vue'
import { VM } from '@/packages/vm'
import { sanitizeStory, applyTheme } from '../../functions'

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

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:currentPageId'])

// Sanitize incoming story
const sanitizedStory = ref(null)
watch(
  () => props.story,
  (incomingStory) => sanitizedStory.value = sanitizeStory(incomingStory),
  { immediate: true },
)

// Determine current page
const currentPage = ref(null)
const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw

watchEffect(() => {
  const foundPage = sanitizedStory.value.pages.find((page) => page.id == props.currentPageId)
  currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
})

// Handle <link> containing story's CSS
watchEffect(() => applyTheme(sanitizedStory.value.theme, sanitizedStory.value.id))


// Story navigation
const navigationHistory = ref([]) // array of page IDs

watch(
  () => props.currentPageId,
  (newPageId) => {
    navigationHistory.value.push(newPageId)
  },
  { immediate: true },
)

function goTo(pageId) {
  const foundPage = sanitizedStory.value.pages.find((page) => page.id == pageId)
  if (!foundPage) {
    console.warn(`CmsStory.goTo: page '${pageId}' not found`)
    return
  }

  currentPage.value = foundPage
  emit('update:currentPageId', pageId)
}

function goBack() {
  navigationHistory.value.pop() // remove THIS page from history
  const lastPageId = navigationHistory.value.pop()
  if (!lastPageId) {
    console.warn('CmsStory.goBack: Already at start')
    return
  }

  goTo(lastPageId)
}

// Provide global story methods (used by CmsBlock)
provide('$_cms_story', {
  goTo,
  goBack
})

/*
const curIndex = ref(0)
const curPage = computed(() => ({
  ...(props.story.pages?.[curIndex.value]),
  'v-if': undefined,
}))

watch(
  () => props.currentPageId,
  (newValue) => {
    curIndex.value = newValue !== null ? props.story?.pages.findIndex((pg) => pg.id == newValue) : 0
    if (curPage.value?.id !== newValue) {
      emitCurrentPageId()
    }
  },
  { immediate: true },
)

function emitCurrentPageId() {
  const foundPage = props.story.pages?.[curIndex.value]
  emit('update:currentPageId', foundPage?.id)
}

const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw


const outgoingPaths = computed(() => {
  return parsedStory.value.paths.filter((p) => p.from == curPage.value?.id)
})



const history = ref([])

function traverse(path) {
  const targetIndex = props.story.pages.findIndex((p) => p.id == path.to)
  transitionDirection.value = targetIndex > curIndex.value ? 'fw' : 'bw'
  curIndex.value = targetIndex
  emitCurrentPageId()

  history.value.push({
    path,
    date: new Date(),
  })
}

const next = computed(() => outgoingPaths.value.length ?
  () => traverse(outgoingPaths.value[0])
  : null)

const back = computed(() => history.value.length > 0 ?
  () => {
    const prevEntry = history.value.pop()
    curIndex.value = props.story.pages.findIndex((p) => p.id == prevEntry.path.from)
    emitCurrentPageId()
    transitionDirection.value = 'bw'
  }
  : null)

const storyVM = new VM()
const parsedStory = ref({
  pages: [],
  paths: [],
})

watch(
  () => props.modelValue,
  async () => {
    const pathPromises = []
    var paths = []

    if (props.story?.paths?.length) {
      for (const curPath of props.story.paths) {
        if (curPath['v-if']) {
          pathPromises.push(storyVM.eval(curPath['v-if'], props.modelValue))
        } else {
          pathPromises.push(true)
        }
      }
      const visiblePathIndexes = await Promise.all(pathPromises)
      paths = props.story.paths.filter((_, index) => visiblePathIndexes[index])
    }

    const pagePromises = []
    for (const page of props.story.pages) {
      if (page['v-if']) {
        pagePromises.push(storyVM.eval(page['v-if'], props.modelValue))
      } else {
        pagePromises.push(true)
      }
    }
    const visiblePageIndexes = await Promise.all(pagePromises)

    for (const pageIndex in props.story.pages) {
      if (!visiblePageIndexes[pageIndex]) {
        // Bridge paths around node

        // Obtain all incoming and outgoing paths
        const page = props.story.pages[pageIndex]
        const incomingPaths = paths.filter((p) => p.to == page.id)
        const outgoingPaths = paths.filter((p) => p.from == page.id)

        // Delete all paths connected to this (now absent) node
        paths = paths.filter((p) => p.from != page.id && p.to != page.id)

        // Create a bridge between each incoming and outgoing path
        incomingPaths.forEach((incoming) => {
          outgoingPaths.forEach((outgoing) => {
            paths.push(Object.assign({}, outgoing, {
              from: incoming.from,
              to: outgoing.to,
            }))
          })
        })
      }
    }

    parsedStory.value.paths = paths
    parsedStory.value.pages = props.story.pages.filter((_, index) => visiblePageIndexes[index])
  },
  { immediate: true, deep: true },
)
*/

function onUpdateModelValue(event) {
  emit('update:modelValue', event)
}
</script>

<template>
  <div class="CmsStory">
    <div class="CmsStory__container">
      <Transition :name="`${transitionName}--${transitionDirection}`">
        <KeepAlive>
          <CmsBlock
            v-if="currentPage"
            :key="currentPage.id"
            class="CmsStory__page"
            :block="currentPage"
            :model-value="props.modelValue"
            @update:modelValue="onUpdateModelValue"
          />
        </KeepAlive>
      </Transition>
    </div>
  </div>
</template>

<style lang="scss">
.CmsStory {
  @import "./transitions.scss";
  --cms-story-transition-duration: var(--ui-duration-quick);

  &__container {
    position: relative;
  }
}
</style>