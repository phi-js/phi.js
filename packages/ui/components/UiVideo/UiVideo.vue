<script setup>
import { ref, watch, computed } from 'vue'

import VideoNative from './Native/Native.vue'
import VideoYoutube from './Youtube/Youtube.vue'
import VideoVimeo from './Vimeo/Vimeo.vue'
import VideoMicrosoft from './Microsoft/Microsoft.vue'

const props = defineProps({
  /**
   * URL del video (YouTube, Vimeo, Microsoft, o URL para usar en <video src="URL" />)
   */
  url: {
    type: String,
    required: false,
    default: null,
  },

  /* v-models */
  isPlaying: {
    type: Boolean,
    required: false,
    default: false,
  },

  currentTime: {
    type: [Number, String],
    required: false,
    default: 0,
  },

  /**
     * Arreglo especificando capitulos
     * <pre>
     * [
     *   {
     *     name: "Capitulo 1",
     *     start: 0,
     *     end: 3000  // ms.
     *     onStart: null  // 'pause' | [time in ms] | null
     *     onEnd: null  // 'pause' | [time in ms] | null
     *   },
     *   ...
     * ]
     * </pre>
     */
  chapters: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits([
  'update:isPlaying',
  'update:currentTime',

  'update:activeChapters', // Emits an ARRAY of chapter names ['Capitulo 1', ...]
  'chapter-enter',
  'chapter-leave',
])

const innerIsPlaying = ref(false)
watch(
  () => props.isPlaying,
  (newValue) => innerIsPlaying.value = newValue,
  { immediate: true },
)

const innerCurrentTime = ref(0)
watch(
  () => props.currentTime,
  (newValue) => {
    innerCurrentTime.value = newValue
  },
  { immediate: true },
)


const innerChapters = ref([])

const videoComponent = computed(() => {
  if (!props.url) {
    return null
  }

  if (/(youtube\.|youtu\.)/.test(props.url)) {
    return VideoYoutube
  }

  if (/(vimeo\.)/.test(props.url)) {
    return VideoVimeo
  }

  if (/(microsoftstream\.com)/.test(props.url)) {
    return VideoMicrosoft
  }

  return VideoNative
})

watch(
  () => props.chapters,
  (newChapters) => {
    let incoming = Array.isArray(newChapters) ? newChapters : []
    innerChapters.value = incoming
      .filter((chapter) => !!chapter && typeof chapter == 'object')
      .map((chapter, i) => ({
        ...chapter,
        name: chapter.name || i,
        start: chapter.start || 0,
        end: chapter.end || Infinity,

        onStart: chapter.onStart,
        onEnd: chapter.onEnd,

        isActive: !!innerChapters.value[i]?.isActive,
      }))
  },
  { immediate: true },
)

function goToChapter(chapterName) {
  const foundChapter = innerChapters.value.find((c) => c.name == chapterName)
  if (!foundChapter) {
    console.warn(`UiVideo: Chapter '${chapterName}' not found`)
    return
  }

  setTimeout(() => innerCurrentTime.value = foundChapter.start, 0)
}

defineExpose({
  goToChapter,
  play: () => innerIsPlaying.value = true,
  pause: () => innerIsPlaying.value = false,
  stop: () => {
    innerIsPlaying.value = false
    innerCurrentTime.value = 0
  },
})

/*
event: "pause" | [time in ms.] | null
*/
function runEventListener(event) {
  if (event === 'pause') {
    innerIsPlaying.value = false
    emit('update:isPlaying', false)
    return
  }

  const targetTime = parseInt(event)
  if (targetTime >= 0) {
    // innerCurrentTime.value = targetTime
    setTimeout(() => innerCurrentTime.value = targetTime, 0)
  }
}

function onUpdateCurrentTime(msTime) {
  innerCurrentTime.value = msTime
  emit('update:currentTime', msTime)

  let activeChapters = []
  let chapterChanged = false
  for (let i = 0; i < innerChapters.value.length; i++) {
    let c = innerChapters.value[i]
    let isActive = c.start <= msTime && msTime < c.end

    if (isActive) {
      activeChapters.push(c.name)
    }

    if (isActive != c.isActive) {
      c.isActive = isActive
      chapterChanged = true

      // chapter event listeners
      if (isActive) {
        runEventListener(c.onStart)
        emit('chapter-enter', c.name)
      } else {
        runEventListener(c.onEnd)
        emit('chapter-leave', c.name)
      }
    }
  }

  if (chapterChanged) {
    emit('update:activeChapters', activeChapters)
  }
}
</script>

<template>
  <component
    :is="videoComponent"
    v-if="videoComponent"
    :is-playing="innerIsPlaying"
    :current-time="innerCurrentTime"
    class="UiVideo"
    :url="url"
    @update:current-time="onUpdateCurrentTime"
    @update:is-playing="innerIsPlaying = $event; $emit('update:isPlaying', $event)"
  />
  <div
    v-else
    class="UiVideo UiVideo--empty"
    v-text="url ? 'URL inválida' : 'No hay URL'"
  />
</template>

<style lang="scss">
.UiVideo {
  // width: auto; // don't mess with the video dimensions.  Let sizing/styling come from props or elsewhere.
  // height: auto;
  // min-height: 280px;

  &--empty {
    min-height: 256px;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.08);
  }
}
</style>