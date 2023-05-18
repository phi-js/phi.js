<script setup>
import { ref } from 'vue'
import UiInputQty from './UiInputQty.vue'

const quantity = ref(1)
</script>

<template>
  <div class="Docs">
    <h1>UiInputQty</h1>
    <code>import { UiInputQty } from '@/packages/ui'</code>
    <p>A customizable input component for selecting quantities with increment and decrement buttons.</p>

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
          <td>The current value of the input</td>
          <td>Number, String</td>
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
          <td>Emitted when the input value changes</td>
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
        <!-- No slots available for this component -->
      </tbody>
    </table>

    Examples of use:

    <pre><code>&lt;UiInputQty :modelValue="5" /&gt;

&lt;UiInputQty v-model="quantity" /&gt;
</code></pre>

    <UiInputQty :model-value="5" />

    <UiInputQty v-model="quantity" />
  </div>
</template>