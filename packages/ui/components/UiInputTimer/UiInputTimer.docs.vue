<script setup>
import UiInputTimer from './UiInputTimer.vue'
</script>

<template>
  <div class="Docs">
    <h1>UiInputTimer</h1>
    <code>import { UiInputTimer } from '@/packages/ui'</code>
    <p>
      UiInputTimer is a Vue component that allows users to input a timer value in minutes, seconds, and milliseconds. It provides separate input fields for each unit of time and updates the model value accordingly.
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
          <td>Timer value in milliseconds (e.g. 100749).</td>
          <td>String | Number</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>step</td>
          <td>Step value for the input fields.</td>
          <td>String | Number</td>
          <td>false</td>
          <td>1</td>
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
          <td>Emitted when the timer value is updated.</td>
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
        There are no slots available for this component.
      </tbody>
    </table>

    <pre><code>&lt;UiInputTimer :model-value="100749" /&gt;
&lt;UiInputTimer :model-value="100749" :step="5" /&gt;
</code></pre>

    <UiInputTimer :model-value="100749" />
    <UiInputTimer
      :model-value="100749"
      :step="5"
    />
  </div>
</template>