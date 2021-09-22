<script setup>
import { ref } from 'vue'
import { UiSelect } from './index.js'
import records from './records.js'

const singlePerson = ref()
const manyPeople = ref([])
</script>
<template>
  <h1>UiSelect</h1>

  <p>Dado un arreglo de objetos arbitratios:</p>
  <pre class="docs-code"><code>const records = {{ records }}</code></pre>

  <p>Podemos declarar un UiSelect asi:</p>
  <pre class="docs-code"><code>
&lt;UiSelect
  v-model="singlePerson"
  :options="records"
  placeholder="Escoge una persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    v-model="singlePerson"
    :options="records"
    placeholder="Escoge una persona"
    option-value="$.id"
    option-text="$.email"
  />
  <pre>singlePerson: {{ singlePerson }}</pre>

  <p>Multiple:</p>
  <pre class="docs-code"><code>
&lt;UiSelect
  v-model="manyPeople"
  multiple
  :options="records"
  placeholder="Escoge varias persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    v-model="manyPeople"
    multiple
    :options="records"
    placeholder="Escoge varias persona"
    option-value="$.id"
    option-text="$.email"
  />
  <pre>manyPeople: {{ manyPeople }}</pre>
</template>
