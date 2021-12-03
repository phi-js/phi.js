<script setup>
import { ref } from 'vue'
import story from './sample.js'
import CmsStory from './CmsStory.vue'

const modelValue = ref({ limit: 3 })
</script>

<template>
  <CmsStory
    v-model="modelValue"
    :story="story"
  />
</template>