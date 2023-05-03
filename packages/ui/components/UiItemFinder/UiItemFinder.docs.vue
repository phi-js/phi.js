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
  <div class="Docs">
    <h1>UiItemFinder</h1>
    <code>import { UiItemFinder } from '@/packages/ui'</code>
    <p>
      The UiItemFinder component is a search and filter component for hierarchical data. It displays a search input and a list of items, and allows users to search for items by typing in the search input. The component filters the items based on the search query and displays the matching items.
    </p>

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
          <td>An array of hierarchical items, each item can contain text, subtext, icon, and children.</td>
          <td>Array</td>
          <td>false</td>
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
          <td>select-item</td>
          <td>Emitted when an item is clicked, passing the selected item as a payload.</td>
        </tr>
        <tr>
          <td>update:searchString</td>
          <td>Emitted when the search input value changes, passing the updated search string as a payload.</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>body</td>
          <td>Slot to customize the contents of the UiItemFinder body.</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
&lt;UiItemFinder :items="items" @select-item="onSelectItem" /&gt;

&lt;UiItemFinder :items="items" @select-item="onSelectItem"&gt;
  &lt;template #body&gt;Custom body content&lt;/template&gt;
&lt;/UiItemFinder&gt;
</code></pre>

    <UiItemFinder
      :items="items"
      @select-item="onSelectItem"
    />

    <hr>

    <UiItemFinder
      :items="items"
      @select-item="onSelectItem"
    >
      <template #body>
        Custom body content
      </template>
    </UiItemFinder>
  </div>
</template>