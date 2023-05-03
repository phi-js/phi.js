<script setup>
import { ref } from 'vue'
import { UiIconPicker } from '.'
const icon = ref('mdi:account')
</script>

<template>
  <div class="Docs">
    <h1>UiIconPicker</h1>
    <code>import { UiIconPicker } from '@/packages/ui'</code>
    <p>
      UiIconPicker is a component that allows users to select an icon from a predefined list provided by Material Design Icons. It consists of a display of the currently selected icon and a dialog containing a paginated list of icons or a search functionality to filter icons.
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
          <td>The currently selected icon value</td>
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
          <td>Emitted when the selected icon is changed</td>
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
          <td>Custom content for the dialog header</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>&lt;UiIconPicker v-model="icon"&gt;
  &lt;template #header&gt;Custom Header&lt;/template&gt;
&lt;/UiIconPicker&gt;
</code></pre>

    <UiIconPicker v-model="icon">
      <template #header>
        Custom Header
      </template>
    </UiIconPicker>
  </div>
</template>
