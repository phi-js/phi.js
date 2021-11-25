<script setup>
import { ref } from 'vue'
import story from '../CmsStory/sample.js'
import CmsStoryEditor from './CmsStoryEditor.vue'
import CmsStory from '../CmsStory/CmsStory.vue'

const modelValue = ref({ limit: 4 })
const showPreview = ref(false)
const settings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })

</script>

<template>
  <label><input
    v-model="showPreview"
    type="checkbox"
  >Show preview</label>

  <CmsStoryEditor
    v-show="!showPreview"
    v-model:story="story"
    :settings="settings"
  />

  <CmsStory
    v-if="showPreview"
    v-model="modelValue"
    :story="story"
  />
</template>