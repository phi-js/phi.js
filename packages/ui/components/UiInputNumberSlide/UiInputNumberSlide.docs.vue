<script setup>
import { ref } from 'vue'
import { UiInputNumberSlide } from '.'
import UiInput from '../UiInput/UiInput.vue'
const num = ref(0)
</script>

<template>
  <div class="Docs">
    <h1>UiInputNumberSlide</h1>
    <code>import { UiInputNumberSlide } from '@/packages/ui'</code>
    <!-- eslint-disable-next-line max-len -->
    <p>An input component that allows users to change the value by sliding the mouse or touch horizontally. The component is useful for selecting values in a range with a custom step value.</p>

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
          <td>The value of the input</td>
          <td>String, Number</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>step</td>
          <td>The step value for the slider</td>
          <td>String, Number</td>
          <td>No</td>
          <td>1</td>
        </tr>
        <tr>
          <td>stepWidth</td>
          <td>Number of pixels to travel for the input to increment by one step</td>
          <td>String, Number</td>
          <td>No</td>
          <td>8</td>
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
          <td>Emits the updated value of the input when changed</td>
        </tr>
      </tbody>
    </table>


    <pre><code>
&lt;UiInputNumberSlide
  v-model="num"
  :step="2"
  :stepWidth="10"
/&gt;
</code></pre>

    <UiInputNumberSlide
      v-model="num"
      :step="2"
      :step-width="10"
    />
  </div>

  <fieldset>
    <legend>step: default (1), stepWidth: default (4)}</legend>
    <UiInputNumberSlide
      v-model="num"
    />
  </fieldset>

  <fieldset>
    <legend>step: 17, stepWidth: default (4)</legend>
    <UiInputNumberSlide
      v-model="num"
      step="17"
    />
  </fieldset>

  <fieldset>
    <legend>step: default (1), stepWidth: 50}</legend>
    <UiInputNumberSlide
      v-model="num"
      step-width="50"
    />
    <br>
    <small>increments step every 50px</small>
  </fieldset>

  <fieldset>
    <legend>UiInput[type=number-slide]</legend>
    <UiInput
      v-model="num"
      type="number-slide"
      step="50"
      step-width="50"
    />
  </fieldset>

  <pre>num: {{ num }}</pre>
</template>