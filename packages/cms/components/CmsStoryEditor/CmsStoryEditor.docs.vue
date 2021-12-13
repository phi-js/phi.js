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
  <CmsStoryEditor
    v-show="!showPreview"
    v-model:story="story"
    :settings="settings"
  >
    <template #toolbar>
      <label><input
        v-model="showPreview"
        type="checkbox"
      >Preview</label>
    </template>
  </CmsStoryEditor>

  <template v-if="showPreview">
    <label><input
      v-model="showPreview"
      type="checkbox"
    >Preview</label>

    <CmsStory
      v-model="modelValue"
      :story="story"
    />
  </template>
</template>