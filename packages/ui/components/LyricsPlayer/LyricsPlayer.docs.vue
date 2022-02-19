<script setup>
import { ref } from 'vue'
import { UiVideo } from '../UiVideo'
import LyricsPlayer from './LyricsPlayer.vue'

import beethoven from './samples/beethoven/beethoven.js'
import aroundTheBend from './samples/bend/aroundTheBend.js'
import dance from './samples/dance/lyrics.js'
import letItGo from './samples/letitgo/letItGo.js'
import mozart from './samples/mozart/mozart.js'
import oldmaui from './samples/oldmaui/lyrics.js'

const availableLyrics = [
  dance,
  mozart,
  beethoven,
  aroundTheBend,
  letItGo,
  oldmaui,
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

  // Old maui
  .wBlue {
    color: cyan;
  }
  .wRoll {
    // transform: scale(1.1) rotate(360deg); //scale() must be present for rotate() to work  (!)
    animation: roll 0.1s;
    transform: none;
  }
  .wWaxed {
    transform: scale(1.4) rotate(-5deg);
    transition-duration: 0.4s;
  }
  .wWaned {
    transform: scale(1.4) rotate(5deg);
    transition-duration: 0.4s;
  }
  .wOld {
    transform: scale(1.4) rotate(-5deg);
    color: brown;
  }
  .wMa {
    transform: scale(1.4) rotate(-15deg);
    color: red;
  }
  .wUi {
    transform: scale(1.4) rotate(15deg);
    color: red;
  }

  .wMe {
    transform: scale(0.7) rotate(-10deg);
    color: #999;
  }
  .wBoys {
    transform: scale(0.7) rotate(10deg);
    color: #999;

    &::after {
      content: "!";
    }
  }
}
</style>