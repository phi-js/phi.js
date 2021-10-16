<script setup>
import { ref } from 'vue'
import { UiInputUrl } from '.'
const url = ref()
</script>

<template>
  <UiInputUrl
    v-model="url"
    placeholder="Some URL"
    endpoint="http://v4.local/1/cms/pages/test/files"
  />
  <pre>url: {{ url }}</pre>
</template>