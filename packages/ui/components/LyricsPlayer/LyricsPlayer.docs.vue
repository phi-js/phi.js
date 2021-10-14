<script setup>
import { ref } from 'vue'
import { UiVideo } from '../UiVideo'
import LyricsPlayer from './LyricsPlayer.vue'
import sample from './sample.js'

const player = ref()

function onVideoTimeupdate(eventData) {
  player.value.setTime(eventData.time) // re-sincroniza el player de lyrics
}
</script>

<template>
  <div class="ui-row">
    <UiVideo
      url="https://www.youtube.com/watch?v=sPXTm6g0ejg"
      style="min-height: 420px"
      @play="player.play()"
      @pause="player.pause()"
      @timeupdate="onVideoTimeupdate"
    />

    <LyricsPlayer
      ref="player"
      :value="sample"
    />
  </div>
</template>