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
  <div class="Docs">
    <h1>UiItemGrid</h1>
    <code>import { UiItemGrid } from '@/packages/ui'</code>
    <p>UiItemGrid is a grid of UiItem components. It accepts an array of items as a prop and emits a click-item event when an item is clicked.</p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>items</td>
          <td>An array of objects representing each item in the grid. Each object must have the following properties:</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>click-item</td>
          <td>Emitted when an item in the grid is clicked. The clicked item object is passed as an argument.</td>
        </tr>
      </tbody>
    </table>

    Examples:
    <input
      v-model="n"
      type="number"
    >

    <pre><code>&lt;UiItemGrid :items="items" /&gt;</code></pre>
    <UiItemGrid :items="items" />
  </div>
</template>