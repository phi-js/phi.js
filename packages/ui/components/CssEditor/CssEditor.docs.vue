<!-- eslint-disable max-len -->
<script setup>
import { ref } from 'vue'
import CssEditor from './CssEditor.vue'

const css = ref(`:root {
  font-family: MyFontWhatever, sans-serif;
  font-size: 14pt;
  text-shadow: 1px 1px 1px #000;
  background-image: url(https://fastly.picsum.photos/id/642/150/150.jpg?hmac=0-Ra00pesmnwUHEosLHxp_sKqoY3Fpd6MMdyfcnnQb0);
  background-color: gray;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  margin: 10px;
  margin-top: 25px;
  padding: 64px 64px 64px 64px;
  height: 420px;
  color: #fff;
}`)
</script>

<template>
  <div class="Docs">
    <h1>CssEditor</h1>
    <code>import { CssEditor } from '@/packages/cms'</code>
    <p>
      CssEditor is a Vue component that provides a user interface for editing CSS styles. It allows users to edit CSS rules with a simple UI, or in a raw format by toggling the "source" mode.
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
          <td>A string containing CSS rules.</td>
          <td>String</td>
          <td>false</td>
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
          <td>Emitted when the CSS rules are updated.</td>
        </tr>
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
          <td>Slot for customizing the header of the CssEditor.</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>&lt;CssEditor v-model="css"&gt;
  &lt;template #header&gt;Custom Header&lt;/template&gt;
&lt;/CssEditor&gt;
</code></pre>

    <CssEditor v-model="css">
      <template #header>
        Custom Header
      </template>
    </CssEditor>
  </div>
</template>