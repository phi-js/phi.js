<script setup>
import { ref } from 'vue'
import UiCard from './UiCard.vue'

const card = ref({
  cover: 'https://picsum.photos/400/250',
  color: '#900',
  text: 'hola mundo',
})
</script>

<template>
  <div class="UiCard-docs">
    <h1>UiCard</h1>
    <UiCard v-bind="card" />
  </div>
</template>