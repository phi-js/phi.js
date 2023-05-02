<script setup>

import UiFolder from './UiFolder.vue'

const items = [
  {
    type: 'suggestion',
    data: {
      text: 'Enlaces planeaciones I trimestre',
      subtext: 'La guia de enlaces para tal cosa',
      icon: 'mdi:file-excel',
      preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
    },
  },
  {
    type: 'suggestion',
    data: {
      text: 'Enlaces planeaciones II trimestre',
      subtext: 'La otra guia de enlaces para tal cosa',
      icon: 'mdi:file-excel',
      preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
    },
  },

  { type: 'folder', data: { text: 'Actas' } },
  { type: 'folder', data: { text: 'Backups' } },
  { type: 'folder', data: { text: 'Burocracia' } },
  { type: 'folder', data: { text: 'Casos' } },
  { type: 'folder', data: { text: 'Actas' } },
  { type: 'folder', data: { text: 'Backups' } },
  { type: 'folder', data: { text: 'Burocracia' } },
  { type: 'folder', data: { text: 'Casos' } },


  {
    type: 'interface',
    data: {
      text: 'Planeaciones I trimestre',
      subtext: 'La guia de enlaces para tal cosa',
      icon: 'mdi:file-excel',
      preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
    },
  },
  {
    type: 'interface',
    data: {
      text: 'Planeaciones II trimestre',
      subtext: 'La otra guia de enlaces para tal cosa',
      icon: 'mdi:file-excel',
      preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
    },
  },
]

const sectionsA = [
  {
    text: 'Suggestions',
    match: { type: 'suggestion' },
  },
]

const sections = [
  {
    text: 'Folders',
    match: { type: 'folder' },
  },
  {
    text: 'Interfaces',
    match: { type: 'interface' },
  },
]
</script>

<template>
  <div class="Docs">
    <h1>UiFolder</h1>
    <code>import { UiFolder } from '@/packages/ui'</code>
    <p>
      Component for displaying a collection of items in a folder-like fashion.
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
          <td>Array of items to be displayed.</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>sections</td>
          <td>Array of section objects. Each object should have a "text" property and a "match" property, where the "match" property is an object that will be used to filter the items to be displayed.</td>
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
        No events emitted by this component.
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
          <td>header</td>
          <td>Custom content to be displayed in the header of the component.</td>
          <td>N/A</td>
        </tr>
        <tr>
          <td>actions</td>
          <td>Custom content to be displayed as actions for each item. Slot bindings include the item object for the current row.</td>
          <td>
            <ul>
              <li>item: Object - The item object for the current row.</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <pre><code>
import { UiFolder } from '@/packages/ui'

&lt;UiFolder
  :items="[
    {
      path: '/path/to/item1',
      type: 'itemType1',
      data: {
        text: 'Item 1',
        subtext: 'Some subtext',
        icon: 'mdi:file',
      },
    },
    {
      path: '/path/to/item2',
      type: 'itemType2',
      data: {
        text: 'Item 2',
        subtext: 'Some subtext',
        icon: 'mdi:file',
      },
    },
  ]"
  :sections="[
    {
      text: 'Section 1',
      match: { type: 'itemType1' },
    },
    {
      text: 'Section 2',
      match: { type: 'itemType2' },
    },
  ]"
>
  &lt;template #actions="{ item }">
    &lt;UiButton @click="editItem(item)">Edit&lt;/UiButton>
    &lt;UiButton @click="deleteItem(item)">Delete&lt;/UiButton>
  &lt;/template>
&lt;/UiFolder>
</code></pre>

    <UiFolder
      :items="[
        {
          path: '/path/to/item1',
          type: 'itemType1',
          data: {
            text: 'Item 1',
            subtext: 'Some subtext',
            icon: 'mdi:file',
          },
        },
        {
          path: '/path/to/item2',
          type: 'itemType2',
          data: {
            text: 'Item 2',
            subtext: 'Some subtext',
            icon: 'mdi:file',
          },
        },
      ]"
      :sections="[
        {
          text: 'Section 1',
          match: { type: 'itemType1' },
        },
        {
          text: 'Section 2',
          match: { type: 'itemType2' },
        },
      ]"
    >
      <template #actions="{ item }">
        <button>Edit</button>
        <button>Delete</button>
      </template>
    </UiFolder>



    <UiFolder
      :items="items"
      :sections="sectionsA"
    />
    <UiFolder
      :items="items"
      :sections="sections"
    />
  </div>
</template>