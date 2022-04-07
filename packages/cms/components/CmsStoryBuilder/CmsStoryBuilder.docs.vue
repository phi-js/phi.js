<script setup>
import { ref } from 'vue'
import CmsStoryBuilder from './CmsStoryBuilder.vue'

const story = ref()

</script>

<template>
  <div class="CmsStoryBuilderDocs">
    <CmsStoryBuilder v-model:story="story" />
    <pre>story: {{ story }}</pre>
  </div>
</template>