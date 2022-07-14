<script setup>
import { ref, computed } from 'vue'
import UiItemFinder from './UiItemFinder.vue'

const n = ref(10)

const items = computed(() => {
  return Array(n.value)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      icon: 'mdi:vuejs',
      text: `Item ${index + 1}`,
      keywords: 'ja je ji',
      children: Array(4).fill(null).map((_, subindex) => ({
        id: (index + 1) + '-child-' + subindex,
        icon: 'mdi:one-up',
        text: 'Hijole',
        keywords: 'soy un hijo',

        children: subindex != 0 ? null : [
          { icon: 'mdi:zip-disk', text: 'opa!' },
          { icon: 'mdi:zip-disk', text: 'opa!' },
          { icon: 'mdi:zip-disk', text: 'opa!' },
          { icon: 'mdi:zip-disk', text: 'opa!' },
        ],
      })),
    }))
})

</script>

<template>
  <div class="UiItemFinderDocs">
    <h1>UiItemFinder</h1>
    <p>Recibe una lista (recursiva) de ITEMS, y los presenta en un grid buscable</p>
    <!-- <pre>{{ items }}</pre> -->
    <UiItemFinder :items="items" />
  </div>
</template>