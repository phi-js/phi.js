<script setup>
import { ref } from 'vue'
import CmsStory from './CmsStory.vue'
import story from './sample.js'

const modelValue = ref({ limit: 3 })
const curPageId = ref()
</script>

<template>
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