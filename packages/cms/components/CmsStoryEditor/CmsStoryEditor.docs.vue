<script setup>
import { ref } from 'vue'
import { CmsStoryEditor } from '.'
import { CmsStory } from '../CmsStory'
import sampleStory from '../CmsStory/samples/foo.story.js'

const story = ref(sampleStory)

const model = ref({
  persona: {
    firstName: 'Pedro',
    lastName: 'Perez',
  },
})
</script>

<template>
  <CmsStoryEditor v-model:story="story" />
  <hr>
  <CmsStory
    v-model="model"
    :story="story"
  />
</template>