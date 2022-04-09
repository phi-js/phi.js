<script setup>
import { ref, computed } from 'vue'
import UiItemFinder from './UiItemFinder.vue'

const n = ref(100)

const items = computed(() => {
  return Array(n.value)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      icon: 'mdi:vuejs',
      text: `Item ${index + 1}`,
      keywords: 'ja je ji',
      tabs: [(index % 2 ? 'Pares' : 'Impares')],
    }))
})

</script>

<template>
  <div class="UiItemFinderDocs">
    <UiItemFinder :items="items" />
  </div>
</template>