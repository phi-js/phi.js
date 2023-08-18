<script setup>
import { ref } from 'vue'
import UiInputRating from './UiInputRating.vue'

const rating = ref()
</script>

<template>
  <div class="UiInputRating-docs">
    <UiInputRating v-model="rating" />
    <pre>rating: {{ rating }}</pre>
  </div>
</template>