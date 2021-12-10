<script setup>
import { ref } from 'vue'
import UiGraphGrid from './UiGraphGrid.vue'

const graph = ref({
  nodes: [
    { id: 1, text: 'inicio' },
    { id: 2 },
    { id: '2a' },
    { id: '2b' },
    { id: 3 },
    { id: 4 },
  ],
  paths: [
    { from: 1, to: 2 },
    { from: 1, to: '2a' },
    { from: 1, to: '2b' },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: '2a', to: 4 },
    { from: '2b', to: 4 },
  ],
})

</script>

<template>
  <h1>UiGraphGrid</h1>
  <UiGraphGrid :graph="graph" />
</template>