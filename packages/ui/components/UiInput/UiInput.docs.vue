<script setup>
import { UiInput } from './index.js'
</script>

<template>
  <div class="Docs">
    <h1>UiInput</h1>
    <code>import { UiInput } from '@/packages/ui'</code>
    <p>
      UiInput is a versatile input component for Vue.js applications. It supports various input types, including text, number, date, time, and custom components. It also provides features such as validation, focus management, and input formatting.
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
          <td>type</td>
          <td>The input type (e.g., 'text', 'number', 'date', 'time', etc.).</td>
          <td>String</td>
          <td>No</td>
          <td>'text'</td>
        </tr>
        <tr>
          <td>modelValue</td>
          <td>The value bound to the input.</td>
          <td>String, Number, Boolean, Object, Array, Date</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>label</td>
          <td>The input label.</td>
          <td>String, Number</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>The input placeholder.</td>
          <td>String, Number</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>subtext</td>
          <td>Additional text displayed below the input.</td>
          <td>String, Number</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>disabled</td>
          <td>Whether the input is disabled.</td>
          <td>Boolean, String, Number</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>required</td>
          <td>Whether the input is required.</td>
          <td>Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>errors</td>
          <td>An array of error messages to display below the input.</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>debounce</td>
          <td>Debounce time (in milliseconds) for emitting model value updates.</td>
          <td>String, Number</td>
          <td>No</td>
          <td>0</td>
        </tr>
        <tr>
          <td>rules</td>
          <td>An array of validation rules for the input (see ./validation.js).</td>
          <td>Array</td>
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
          <td>Emitted when the input value is updated.</td>
        </tr>
        <tr>
          <td>focus</td>
          <td>Emitted when the input gains focus.</td>
        </tr>
        <tr>
          <td>blur</td>
          <td>Emitted when the input loses focus.</td>
        </tr>
        <tr>
          <td>invalid</td>
          <td>Emitted when the input value is invalid according to the validation rules.</td>
        </tr>
        <tr>
          <td>click</td>
          <td>Emitted when the input is clicked.</td>
        </tr>
        <tr>
          <td>click-label</td>
          <td>Emitted when the input label is clicked.</td>
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
          <td>default</td>
          <td>Slot for custom input components.</td>
          <td>None</td>
        </tr>
        <tr>
          <td>subtext</td>
          <td>Slot for custom subtext content.</td>
          <td>None</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
&lt;UiInput label="Name" placeholder="Enter your name" /&gt;
&lt;UiInput type="number" label="Age" placeholder="Enter your age" /&gt;
&lt;UiInput type="date" label="Birthdate" /&gt;
&lt;UiInput type="textarea" label="Description" placeholder="Enter a description" /&gt;
</code></pre>

    <UiInput
      label="Name"
      placeholder="Enter your name"
    />
    <UiInput
      type="number"
      label="Age"
      placeholder="Enter your age"
    />
    <UiInput
      type="date"
      label="Birthdate"
    />
    <UiInput
      type="textarea"
      label="Description"
      placeholder="Enter a description"
    />
  </div>
</template>