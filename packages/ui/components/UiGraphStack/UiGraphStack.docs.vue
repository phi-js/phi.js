<script setup>
import { ref } from 'vue'

import UiInput from '../UiInput/UiInput.vue'
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
  <div class="Docs">
    <h1>UiGraphStack</h1>
    <code>import { UiGraphStack } from '@/packages/ui'</code>
    <p>
      UiGraphStack is a Vue component that visualizes a graph with draggable nodes and connections between them. It uses the vuedraggable library to provide drag-and-drop functionality to rearrange the nodes.
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
          <td>graph</td>
          <td>An object containing 'nodes' and 'paths' arrays to represent the graph.</td>
          <td>Object</td>
          <td>true</td>
          <td>-</td>
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
          <td>update:graph</td>
          <td>Emits the updated graph after nodes have been rearranged.</td>
        </tr>
        <tr>
          <td>click-node</td>
          <td>Emits the clicked node object.</td>
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
          <td>node-actions</td>
          <td>A slot for custom actions related to the node.</td>
          <td>node</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
&lt;UiGraphStack :graph="graph" @update:graph="updatedGraph" @click-node="clickedNode"&gt;
  &lt;template #node-actions="{ node }"&gt;
    &lt;button @click="customAction(node)"&gt;Custom Action&lt;/button&gt;
  &lt;/template&gt;
&lt;/UiGraphStack&gt;
</code></pre>

    <div style="max-height: 300px; overflow: auto">
      <UiInput
        v-model="graph"
        label="graph"
        type="json"
      />
    </div>

    <UiGraphStack
      v-model:graph="graph"
      style="max-width: 400px; margin: 30px;"
    >
      <template #node-actions="{ node }">
        <button type="button">
          id:{{ node.id }}
        </button>
      </template>
    </UiGraphStack>
  </div>
</template>

<style lang="scss">
.Docs {
  .UiGraphStack__listItem {
    height: 48px;
    --ui-item-padding: 10px;
    user-select: none;
    border-radius: 4px;
    background-color: var(--ui-color-primary);
    color: #fff;
  }
}
</style>