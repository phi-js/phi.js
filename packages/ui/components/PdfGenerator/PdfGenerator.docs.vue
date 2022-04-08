<script setup>
import { ref } from 'vue'
import PdfGenerator from './PdfGenerator.vue'
import { UiInput } from '../UiInput'

const html = ref('<h1>Hello!</h1>')

const options = ref({
  mode: 'utf-8',
  format: [
    100,
    200,
  ],
  orientation: 'L',
  setters: {
    title: 'Mi documento :)',
    footer: '{PAGENO} de {nbpg}',
  },
})

async function generator({ html, options }) {
  return fetch(
    'http://v4.local/1/esign/pdf/generator',
    {
      method: 'POST',
      body: JSON.stringify({ html, options }),
    },
  ).then((response) => response.blob())
}
</script>

<template>
  <div class="PdfGeneratorDocs">
    <h1>PdfGeneratorDocs</h1>

    <UiInput
      v-model="options"
      type="json"
    />

    <UiInput
      v-model="html"
      type="html"
    />

    <PdfGenerator
      :html="html"
      :options="options"
      :generator="generator"
    />
  </div>
</template>