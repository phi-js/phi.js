<script setup>
import { ref } from 'vue'
import { CmsStoryEditor } from '.'
import { UiInput } from '/packages/ui/components'
import { CmsStory } from '../CmsStory'
import sampleStory from '../CmsStory/samples/foo.story.js'

const editorSettings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })
const isPreview = ref(false)

// const story = ref(sampleStory)
const story = ref({
  nodes: [
    {
      id: 'home',
      card: { text: 'Home' },
      page: { blocks: [] },
    },
  ],
  paths: [],
})
const activeNodeId = ref()
const model = ref({
  persona: {
    firstName: 'Pedro',
    lastName: 'Perez',
  },
})
</script>

<template>
  <UiInput
    v-model="isPreview"
    type="checkbox"
    placeholder="Preview"
  />

  <CmsStoryEditor
    v-show="!isPreview"
    v-model:story="story"
    v-model:activeNodeId="activeNodeId"
    :settings="editorSettings"
  />
  <CmsStory
    v-if="isPreview"
    v-model="model"
    v-model:activeNodeId="activeNodeId"
    :story="story"
  />
</template>