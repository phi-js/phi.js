<script setup>
import { ref } from 'vue'
import { UiVideo } from './index.js'
import UiVideoChaptersEditor from './UiVideoChaptersEditor.vue'

let videoData = ref(null)

let chapters = ref([
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
let activeChapters = ref([])
</script>

<template>
  <section>
    <label>Video controls</label>
    <UiVideo
      ref="myvideo"
      v-model="videoData"
      url="https://www.youtube.com/watch?v=sPXTm6g0ejg"
      style="min-height: 420px"
    />

    <div class="UiGroup">
      <button
        type="button"
        @click="$refs.myvideo.play()"
      >
        Play
      </button>
      <button
        type="button"
        @click="$refs.myvideo.pause()"
      >
        Pause
      </button>
      <button
        type="button"
        @click="$refs.myvideo.stop()"
      >
        Stop
      </button>
    </div>
    <pre>videoData: {{ videoData }}</pre>
  </section>

  <section>
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
  </section>
</template>