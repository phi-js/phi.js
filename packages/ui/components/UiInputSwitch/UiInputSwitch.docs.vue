<script setup>
import { ref } from 'vue'
import UiInputSwitch from './UiInputSwitch.vue'

const switchValue = ref(false)
</script>

<template>
  <div class="Docs">
    <h1>UiInputSwitch</h1>
    <code>import { UiInputSwitch } from '@/packages/ui'</code>
    <p>
      A switch component with optional icons for the true and false states. It can be used as a toggle, with two different icons representing the two states.
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
          <td>The current value of the switch.</td>
          <td>String, Number, Boolean</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>iconTrue</td>
          <td>The icon to be displayed when the switch is in the true state.</td>
          <td>String</td>
          <td>false</td>
          <td>null</td>
        </tr>
        <tr>
          <td>iconFalse</td>
          <td>The icon to be displayed when the switch is in the false state.</td>
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
          <td>update:model-value</td>
          <td>Emitted when the value of the switch changes.</td>
        </tr>
      </tbody>
    </table>


    <pre><code>&lt;UiInputSwitch v-model="switchValue" /&gt;
&lt;UiInputSwitch v-model="switchValue" icon-true="mdi:brightness-5" icon-false="mdi:brightness-2" /&gt;
</code></pre>

    <UiInputSwitch v-model="switchValue" />
    <UiInputSwitch
      v-model="switchValue"
      icon-true="mdi:brightness-5"
      icon-false="mdi:brightness-2"
    />

    <label>
      switchValue: {{ switchValue }}
      <input
        v-model="switchValue"
        type="checkbox"
      >
    </label>
  </div>
</template>