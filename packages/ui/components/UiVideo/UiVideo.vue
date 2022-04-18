<script setup>
import { ref, watch, computed, watchEffect } from 'vue'

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

  'update:activeChapters',
  'chapter-enter',
  'chapter-leave',
])

const innerIsPlaying = ref(false)
watchEffect(() => innerIsPlaying.value = props.isPlaying)

const innerCurrentTime = ref(0)
watchEffect(() => innerCurrentTime.value = props.currentTime)


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
        name: chapter.name || i,
        start: chapter.start || 0,
        end: chapter.end || Infinity,
        pauseOnEnter: !!chapter.pauseOnEnter,
        isActive: !!innerChapters.value[i]?.isActive,
      }))
  },
  { immediate: true },
)

function onUpdateCurrentTime(msTime) {
  emit('update:currentTime', msTime)

  let activeChapters = []
  let hasChanged = false
  for (let i = 0; i < innerChapters.value.length; i++) {
    let c = innerChapters.value[i]
    let isActive = c.start <= msTime && msTime < c.end
    if (isActive != c.isActive) {
      c.isActive = isActive
      hasChanged = true
      emit(isActive ? 'chapter-enter' : 'chapter-leave', c.name)

      // "pauseOnEnter" prop in chapter
      if (isActive && c.pauseOnEnter) {
        innerIsPlaying.value = false
        emit('update:isPlaying', false)
      }
    }

    if (isActive) {
      activeChapters.push(c.name)
    }
  }

  if (hasChanged) {
    emit('update:activeChapters', activeChapters)
  }
}
</script>

<template>
  <div class="UiVideo">
    <component
      :is="videoComponent"
      v-if="videoComponent"
      v-bind="$attrs"
      v-model:is-playing="innerIsPlaying"
      v-model:current-time="innerCurrentTime"
      :url="url"
      @update:current-time="onUpdateCurrentTime"
      @update:is-playing="$emit('update:isPlaying', $event)"
    />
    <div
      v-else
      class="UiVideo--empty"
    >
      {{ url ? 'URL inválida' : 'No hay URL' }}
    </div>
  </div>
</template>

<style lang="scss">
.UiVideo {
  width: auto;
  height: auto;
  min-height: 280px;

  &--empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.08);
    min-height: 256px;
  }
}
</style>