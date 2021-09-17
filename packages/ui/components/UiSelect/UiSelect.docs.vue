<script setup>
import { ref } from 'vue';
import { UiSelect } from './index.js';
import records from './records.js';

const singlePerson = ref();
const manyPeople = ref([]);
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

  :data="records"
  placeholder="Escoge una persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    :value="singlePerson"
    @input="singlePerson = $event"
    :data="records"
    placeholder="Escoge una persona"
    option-value="$.id"
    option-text="$.email"
  />
  <pre>singlePerson: {{ singlePerson }}</pre>

  <p>Multiple:</p>
  <pre class="ui-code"><code>
&lt;UiSelect
  multiple
  :value="manyPeople"
  @input="manyPeople = $event"
  :data="records"
  placeholder="Escoge varias persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    multiple
    :value="manyPeople"
    @input="manyPeople = $event"
    :data="records"
    placeholder="Escoge varias persona"
    option-value="$.id"
    option-text="$.email"
  />
  <pre>manyPeople: {{ manyPeople }}</pre>
</template>