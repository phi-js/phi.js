<script setup>
import { ref } from 'vue'
import { UiVideo } from '../UiVideo'
import LyricsPlayer from './LyricsPlayer.vue'
import sample from './sample.js'

const currentTime = ref(0)

const curClass = ref(false)
</script>

<template>
  <div class="LyricsPlayerDemo">
    <UiVideo
      url="https://www.youtube.com/watch?v=sPXTm6g0ejg"
      @timeupdate="currentTime = $event.time"
    />
    <LyricsPlayer :lines="sample.lines" :currentTime="currentTime" />
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

  .UiVideo {
    flex: 1;
    height: 400px;
  }

  .LyricsPlayer {
    flex: 2;
    font-size: 1.8em;
  }

  // word classes (called by words in sample.js)
  .wRoll {
    // transform: scale(1.1) rotate(360deg); //scale() must be present for rotate() to work  (!)
    animation: roll 0.1s;
    transform: none;
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