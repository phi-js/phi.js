<script setup>
import { ref } from 'vue'
import UiSelectButtons from './UiSelectButtons.vue'

const options = [
  { text: 'Option 1', value: 1 },
  { text: 'Option 2', value: 2 },
  { text: 'Option 3', value: 3 },
  { text: 'Option 4', value: 4 },
  { text: 'Option 5', value: 5 }
]

const singleValue = ref(null)
const multipleValues = ref([])
</script>

<template>
  <div class="docs-page">
    <h1>UiSelectButtons</h1>

    <section>
      <label>Single:</label>
      <UiSelectButtons v-model="singleValue" :options="options" />
      <pre>singleValue: {{ singleValue }}</pre>
    </section>

    <section>
      <label>Multiple:</label>
      <UiSelectButtons v-model="multipleValues" multiple :options="options" />
      <pre>multipleValues: {{ multipleValues }}</pre>
    </section>
  </div>
</template>
