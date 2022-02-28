<script setup>
import { ref } from 'vue'
import { UiVideo } from '../UiVideo'
import LyricsEditor from './LyricsEditor.vue'

const editor = ref()
</script>

<template>
  <UiVideo
    url="https://www.youtube.com/watch?v=n-6OmEYAeOE"
    style="min-height: 420px"
    @play="editor.start()"
  />
  <LyricsEditor ref="editor" />
</template>