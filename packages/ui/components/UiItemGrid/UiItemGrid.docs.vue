<script setup>
import { ref, computed } from 'vue'
import UiItemGrid from './UiItemGrid.vue'

const n = ref(100)

const items = computed(() => {
  return Array(n.value)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      icon: 'mdi:vuejs',
      text: `Item ${index + 1}`,
    }))
})


</script>

<template>
  <div class="UiItemGridDocs">
    <h1>UiItemGrid</h1>
    <!-- <pre>items: {{ items }}</pre> -->
    <UiItemGrid :items="items" />

    <input
      v-model="n"
      type="number"
    >
  </div>
</template>