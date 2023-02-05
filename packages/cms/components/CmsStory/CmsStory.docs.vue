<script setup>
import { ref } from 'vue'
import CmsStory from './CmsStory.vue'
import story from './sample2.js'

const modelValue = ref({
  'limit': 3,
  'things': 'some.things',
  'arrThings': ['hello.workd', 'how.are.you'],
  'person.name': 'hi',
})
const curPageId = ref()
</script>

<template>
  <h1>CmsStory</h1>
  <CmsStory
    v-model="modelValue"
    v-model:currentPageId="curPageId"
    :story="story"
  />

  <!-- <select v-model="curPageId">
    <option
      v-for="page in story.pages"
      :key="page.id"
      :value="page.id"
    >
      {{ page.id }}
    </option>
  </select> -->
</template>