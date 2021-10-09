<script setup>
import { ref } from 'vue'
import SelectOptionsEditor from '../SelectOptionsEditor.vue'


const options = ref()
</script>

<template>
  <h1>SelectEditor.docs.vue</h1>
  <SelectOptionsEditor v-model="options" />
  <pre>options: {{ options }}</pre>
</template>