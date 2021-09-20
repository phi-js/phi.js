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
  <pre class="ui-code"><code>const records = {{ records }}</code></pre>

  <p>Podemos declarar un UiSelect asi:</p>
  <pre class="ui-code"><code>
&lt;UiSelect
  :value="singlePerson"
  @input="singlePerson = $event"

  :options="records"
  placeholder="Escoge una persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    :value="singlePerson"
    :options="records"
    placeholder="Escoge una persona"
    option-value="$.id"
    option-text="$.email"
    @input="singlePerson = $event"
  />
  <pre>singlePerson: {{ singlePerson }}</pre>

  <p>Multiple:</p>
  <pre class="ui-code"><code>
&lt;UiSelect
  multiple
  :value="manyPeople"
  @input="manyPeople = $event"
  :options="records"
  placeholder="Escoge varias persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    multiple
    :value="manyPeople"
    :options="records"
    placeholder="Escoge varias persona"
    option-value="$.id"
    option-text="$.email"
    @input="manyPeople = $event"
  />
  <pre>manyPeople: {{ manyPeople }}</pre>
</template>
