<script setup>
import { ref } from 'vue'
import { UiDropdown } from './index.js'
const isOpen = ref(false)
</script>

<template>
  <div class="Docs">
    <h1>UiDropdown</h1>
    <code>import { UiDropdown } from '@/packages/ui'</code>

    <p>
      The UiDropdown component is used to show/hide content when a trigger element is clicked or hovered. It can be used to create menus, dropdowns, popovers, tooltips and more.
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
          <td>open</td>
          <td>Whether the dropdown is currently open or not</td>
          <td>Boolean | String | Number</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>trigger</td>
          <td>The type of trigger for the dropdown. Can be either 'click' or 'hover'</td>
          <td>String</td>
          <td>No</td>
          <td>'click'</td>
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
          <td>update:open</td>
          <td>Emitted when the open state of the dropdown is changed</td>
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
          <td>trigger</td>
          <td>The trigger element for the dropdown</td>
          <td>
            <ul>
              <li><strong>is-open</strong>: Whether the dropdown is currently open or not</li>
              <li><strong>open</strong>: Method to open the dropdown</li>
              <li><strong>close</strong>: Method to close the dropdown</li>
              <li><strong>toggle</strong>: Method to toggle the dropdown</li>
            </ul>
          </td>
        </tr>
        <tr>
          <td>default</td>
          <td>The content of the dropdown that is shown/hidden</td>
          <td>
            <ul>
              <li><strong>close</strong>: Method to close the dropdown</li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>

    <pre><code>
  &lt;UiDropdown&gt;
    &lt;template #trigger&gt;
      &lt;button&gt;Toggle Dropdown&lt;/button&gt;
    &lt;/template&gt;
    &lt;template #default="{ close }"&gt;
      &lt;p&gt;This is the content of the dropdown&lt;/p&gt;
      &lt;button @click="close"&gt;Close Dropdown&lt;/button&gt;
    &lt;/template&gt;
  &lt;/UiDropdown&gt;
</code></pre>


    <UiDropdown>
      <template #trigger>
        <button>Toggle Dropdown</button>
      </template>
      <template #default="{ close }">
        <div>
          <p>This is the content of the dropdown</p>
          <button @click="close">
            Close Dropdown
          </button>
        </div>
      </template>
    </UiDropdown>
  </div>
</template>