<script setup>
import { ref } from 'vue'
import SelectOptionsEditor from './SelectOptionsEditor.vue'
const options = ref()
</script>

<template>
  <SelectOptionsEditor v-model:options="options" />
  <hr>
  <SelectOptionsEditor
    v-model:options="options"
    multiple
  />
  <pre>options: {{ options }}</pre>
</template>