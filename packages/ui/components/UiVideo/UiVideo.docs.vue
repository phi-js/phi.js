<script setup>
import { ref } from 'vue'
import { UiVideo } from './index.js'
let videoData = ref(null)
</script>

<template>
  <UiVideo
    ref="myvideo"
    v-model="videoData"
    url="https://www.youtube.com/watch?v=DSGyEsJ17cI"
  />

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

  <pre>videoData: {{ videoData }}</pre>
</template>