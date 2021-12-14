<script setup>
import { ref } from 'vue'
import story from '../CmsStory/sample.js'
import CmsStoryEditor from './CmsStoryEditor.vue'

// const modelValue = ref({ limit: 4 })
const refStory = ref(story)
const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })
</script>

<template>
  <CmsStoryEditor
    v-model:story="refStory"
    :settings="settings"
  />
  <!-- <pre>{{ refStory }}</pre> -->
</template>