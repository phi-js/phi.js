<script setup>
import { ref } from 'vue'
import { UiItemEditor } from '.'

const item = ref()
</script>

<template>
  <UiItemEditor v-model="item" />
  <pre>item: {{ item }}</pre>
</template>