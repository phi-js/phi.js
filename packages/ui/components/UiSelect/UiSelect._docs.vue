<script setup>
import { ref } from 'vue'
import { default as xrecords } from './records.js'

import { UiSelect } from './index.js'

const singlePerson = ref()
const manyPeople = ref([])
const records = ref(xrecords)
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
  placeholder="Escoge varias personas"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    v-model="manyPeople"
    multiple
    :options="records"
    placeholder="Escoge varias personas"
    option-value="$.id"
    option-text="$.email"
  />

  <section>
    <h2>Aggregator slot</h2>
    <UiSelect
      v-model="manyPeople"
      multiple
      :options="records"
      placeholder="Escoge varias personas"
      option-value="$.id"
      option-text="$.email"
    >
      <template
        #aggregator="{ options }"
      >
        y otras {{ options.length }} personas
      </template>
    </UiSelect>
  </section>

  <pre>manyPeople: {{ manyPeople }}</pre>
</template>
