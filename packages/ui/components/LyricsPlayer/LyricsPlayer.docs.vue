<script setup>
import { ref } from 'vue'
import { UiVideo } from '../UiVideo'
import LyricsPlayer from './LyricsPlayer.vue'

import aroundTheBend from './samples/aroundTheBend.js'
import beethoven from './samples/beethoven.js'
import doTheDance from './samples/doTheDance.js'
import letItGo from './samples/letItGo.js'
import mozart from './samples/mozart.js'
import oldMaui from './samples/oldMaui.js'
import haza from './samples/haza.js'

const availableLyrics = [
  oldMaui,
  aroundTheBend,
  beethoven,
  doTheDance,
  letItGo,
  mozart,
  haza,
]

const lyrics = ref(availableLyrics[0])

const currentTime = ref(0)

function onWordEnter(word) {
  console.log('LyricsPlayer.docs onWordEnter', word)
}
</script>

<template>
  <select @change="lyrics = availableLyrics[$event.target.value]; currentTime = 0">
    <option v-for="(lyr, k) in availableLyrics" :key="k" :value="k">{{ lyr.title }}</option>
  </select>

  <pre>currentTime: {{ currentTime }}</pre>

  <div class="LyricsPlayerDemo" :key="lyrics.title">
    <UiVideo class="video" :url="lyrics.url" @timeupdate="currentTime = $event.time" />
    <LyricsPlayer :lyrics="lyrics" :currentTime="currentTime" @wordEnter="onWordEnter" />
  </div>
</template>

<style lang="scss">
// Old maui extras
@keyframes roll {
  100% {
    transform: rotate(360deg);
  }
}

.LyricsPlayerDemo {
  display: flex;
  align-items: center;

  .video {
    flex: 1;
    height: 400px;
  }

  .LyricsPlayer {
    flex: 2;
    font-size: 1.8em;
  }

  // Old maui extras
  .wBoys::after {
    content: "!";
  }

  .wChat {
    &::before {
      content: '"';
    }
    &::after {
      content: '"';
    }
  }
}
</style>