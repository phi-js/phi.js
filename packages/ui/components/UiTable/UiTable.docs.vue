<script setup>
import { UiTable, UiColumn } from './index.js'
import records from './records.js'
</script>

<template>
  <h1>UiTable</h1>

  <p>Dado un arreglo de objetos arbitratios:</p>
  <pre class="docs-code"><code>const records = {{ records }}</code></pre>

  <p>Podemos definir una tabla así</p>
  <pre class="docs-code"><code>
&lt;UiTable :data="records">
  &lt;UiColumn header="Columna 1" value="timestamp" />

  &lt;UiColumn header="Columna 2">
    &lt;template #content>Item 1&lt;/template>
  &lt;/UiColumn>

  &lt;UiColumn>
    &lt;template #header>Columna 3&lt;/template>
    &lt;template #content="{ item }">
      &lt;img :src="item.image" :alt="item.image" style="max-width: 120px; max-height: 120px" />
    &lt;/template>
    &lt;template #footer>Footer Columna 3&lt;/template>
  &lt;/UiColumn>
&lt;/UiTable>
  </code></pre>

  <UiTable :data="records">
    <UiColumn
      header="Columna 1"
      value="timestamp"
    />

    <UiColumn header="Columna 2">
      <template #content>
        Item 1
      </template>
    </UiColumn>

    <UiColumn>
      <template #header>
        Columna 3
      </template>
      <template #content="{ item }">
        <img
          :src="item.image"
          :alt="item.image"
          style="max-width: 120px; max-height: 120px"
        >
      </template>
      <template #footer>
        Footer Columna 3
      </template>
    </UiColumn>
  </UiTable>
</template>