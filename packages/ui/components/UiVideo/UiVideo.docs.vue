<script setup>
import { ref } from 'vue'
import { UiVideo } from './index.js'
// import UiVideoChaptersEditor from './UiVideoChaptersEditor.vue'

const isPlaying = ref(false)
const currentTime = ref(0)

const chapters = ref([
  {
    name: 'intro',
    start: 0,
    end: 1990,
  },
  {
    name: 'part2',
    start: 1990,
    end: 4431,
  },
])

const activeChapters = ref([])

function play() {
  isPlaying.value = true
}

function pause() {
  isPlaying.value = false
}

function stop() {
  isPlaying.value = false
  currentTime.value = 0
}
</script>

<template>
  <section>
    <label>Video controls</label>
    <UiVideo
      v-model:isPlaying="isPlaying"
      v-model:currentTime="currentTime"
      v-model:activeChapters="activeChapters"
      url="https://www.youtube.com/watch?v=sPXTm6g0ejg"
      style="min-height: 420px"
      :chapters="chapters"
    />

    <div class="UiGroup">
      <button
        type="button"
        @click="play()"
      >
        Play
      </button>
      <button
        type="button"
        @click="pause()"
      >
        Pause
      </button>
      <button
        type="button"
        @click="stop()"
      >
        Stop
      </button>
    </div>
    <pre>isPlaying: {{ isPlaying }}</pre>
    <pre>currentTime: {{ currentTime }}</pre>
    <pre>activeChapters: {{ activeChapters }}</pre>
  </section>

  <!-- <section>
    <label>Video chapters</label>
    <UiVideoChaptersEditor
      v-model="chapters"
      url="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/webcam-1636296308117.mkv"
    />
    <pre>chapters: {{ chapters }}</pre>

    <hr>

    <UiVideo
      url="https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/webcam-1636296308117.mkv"
      :chapters="chapters"
      @update:chapters="activeChapters = $event"
    />
    <pre>activeChapters: {{ activeChapters }}</pre>
  </section> -->
</template>