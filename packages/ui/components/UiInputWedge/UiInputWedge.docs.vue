<script setup>
import { ref } from 'vue'
import { UiInputWedge } from '.'

const someValue = ref('Hello world')
</script>

<template>
  <div class="Docs">
    <h1>UiInputWedge</h1>
    <code>import { UiInputWedge } from '@/packages/ui'</code>
    <p>A component that displays an input field that can be toggled open or closed with an icon. When open, the input field is displayed. When closed, only the icon is displayed.</p>

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
          <td>The value of the input field. Used with v-model.</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>open</td>
          <td>Whether the input field is open or closed.</td>
          <td>Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>The placeholder text for the input field.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>icon</td>
          <td>The icon to use for the toggle button.</td>
          <td>String</td>
          <td>No</td>
          <td>'mdi:variable'</td>
        </tr>
        <tr>
          <td>color</td>
          <td>The color of the icon.</td>
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
          <td>Emitted when the user presses the Enter key after entering a value in the input field.</td>
        </tr>
        <tr>
          <td>update:open</td>
          <td>Emitted when the user clicks the toggle button or presses the Enter key while the toggle button is focused.</td>
        </tr>
      </tbody>
    </table>


    <h2>Example</h2>

    <pre><code>&lt;UiInputWedge
  v-model="someValue"
  v-model:open="isOpen"
  placeholder="Enter a value"
  icon="mdi:arrow-expand-all"
  color="blue"
/&gt;
</code></pre>

    <UiInputWedge
      v-model="someValue"
      v-model:open="isOpen"
      placeholder="Enter a value"
      icon="mdi:arrow-expand-all"
      color="blue"
    />
  </div>
</template>