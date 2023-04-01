<script setup>
import { ref } from 'vue'
import UiGraphStack from './UiGraphStack.vue'

const graph = ref({
  nodes: [
    { id: 1, text: 'inicio' },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
  ],
  paths: [
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 6 },

    { from: 3, to: 1 },
    { from: 3, to: 5 },
    { from: 5, to: 3 },
  ],
})
</script>

<template>
  <h1>UiGraphStack</h1>

  <UiGraphStack
    v-model:graph="graph"
    style="max-width: 400px; margin: 30px;"
  />
</template>