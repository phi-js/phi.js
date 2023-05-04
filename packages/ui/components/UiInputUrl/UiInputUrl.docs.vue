<script setup>
import { ref } from 'vue'
import { UiInputUrl } from '.'
const url = ref()
</script>


<template>
  <div class="Docs">
    <h1>UiInputUrl</h1>
    <code>import { UiInputUrl } from '@/packages/ui'</code>
    <p>
      A text input field for URLs, with an optional file upload button.
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
          <td>modelValue</td>
          <td>The value of the input field</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>endpoint</td>
          <td>The URL to upload files to (optional)</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>The placeholder text for the input field</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
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
          <td>update:modelValue</td>
          <td>Emitted when the value of the input field changes or when a file is uploaded (if endpoint is provided)</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Basic usage</h3>
    <pre><code>&lt;UiInputUrl v-model="url" placeholder="Enter URL here" /&gt;</code></pre>
    <UiInputUrl
      v-model="url"
      placeholder="Enter URL here"
    />

    <h3>With file upload</h3>
    <pre><code>&lt;UiInputUrl v-model="url" placeholder="Enter URL or upload file" :endpoint="backendUrl" /&gt;</code></pre>
    <UiInputUrl
      v-model="url"
      placeholder="Enter URL or upload file"
      :endpoint="backendUrl"
    />
  </div>
</template>