<script setup>
import { ref } from 'vue'
import CmsStoryEditor from '../CmsStoryEditor/CmsStoryEditor.vue'
import story from './sample.js'

const refStory = ref(story)
const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })
</script>

<template>
  <CmsStoryEditor
    v-model:story="refStory"
    :settings="settings"
  />
</template>