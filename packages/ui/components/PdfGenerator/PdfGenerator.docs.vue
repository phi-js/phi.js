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

async function pdfGeneratorFunction({ html, options }) {
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
  <div class="Docs">
    <h1>PdfGenerator</h1>
    <code>import { PdfGenerator } from '@/packages/ui'</code>
    <p>
      The PdfGenerator component is used to render a PDF file from provided HTML and options. It handles the generation of the PDF using a provided generator function and displays the PDF using an object tag, with a fallback to download if the object tag is not supported.
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
          <td>html</td>
          <td>HTML content to be rendered as PDF.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>options</td>
          <td>An object containing options for the PDF generation. See <a href="https://mpdf.github.io/reference/mpdf-functions/construct.html">MPDF constructor options</a> and <a href="https://mpdf.github.io/reference/mpdf-variables/overview.html">MPDF variables</a> for more details.</td>
          <td>Object</td>
          <td>No</td>
          <td>{}</td>
        </tr>
        <tr>
          <td>generator</td>
          <td>An async function that takes an object with 'html' and 'options' properties and returns a BLOB with the generated PDF. This function should typically call an API that generates the PDF blob.</td>
          <td>Function</td>
          <td>Yes</td>
          <td>-</td>
        </tr>
        <tr>
          <td>debounce</td>
          <td>The debounce time in milliseconds between generator function calls.</td>
          <td>Number</td>
          <td>No</td>
          <td>600</td>
        </tr>
      </tbody>
    </table>

    <pre><code>&lt;PdfGenerator
  v-model:html="html"
  :options="options"
  :generator="pdfGeneratorFunction"
  :debounce="500"
/&gt;
</code></pre>

    <UiInput
      v-model="options"
      label="options"
      type="json"
    />

    <UiInput
      v-model="html"
      label="html"
      type="code"
      lang="html"
    />

    <br><hr><br>

    <PdfGenerator
      v-model:html="html"
      :options="options"
      :generator="pdfGeneratorFunction"
      :debounce="500"
    />
  </div>
</template>