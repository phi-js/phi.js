<script setup>
import { ref } from 'vue'
import { UiSelect } from './index.js'
const selectedOption = ref('')
const selectedOptions = ref([])
</script>

<template>
  <div class="Docs">
    <h1>UiSelect</h1>
    <code>import { UiSelect } from '@/packages/ui'</code>
    <p>A versatile, customizable select component for Vue.js applications. It supports single and multiple selections, searching, and more.</p>

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
          <td>multiple</td>
          <td>Whether the select allows multiple selections.</td>
          <td>Boolean</td>
          <td>No</td>
          <td>false</td>
        </tr>
        <tr>
          <td>modelValue</td>
          <td>Value binding for the selected option(s).</td>
          <td>Any</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>Placeholder text for the select input.</td>
          <td>String</td>
          <td>No</td>
          <td>''</td>
        </tr>
        <tr>
          <td>options</td>
          <td>An array of arbitrary objects to be used as a source for options.</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>optionValue</td>
          <td>A JSON PATH string pointing to the item property to be used as a scalar VALUE identifier. Defaults to '$.value'.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>optionText</td>
          <td>A JSON PATH string pointing to the item property to be used as a scalar TEXT identifier. Defaults to '$.text'.</td>
          <td>String</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>optionSearch</td>
          <td>A JSON PATH (or Array of JSON paths) listing the property values to be indexed for searching. Defaults to '$.text'.</td>
          <td>String or Array</td>
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
          <td>Emitted when the selected option(s) is/are changed.</td>
        </tr>
        <tr>
          <td>focus</td>
          <td>Emitted when the select gains focus.</td>
        </tr>
        <tr>
          <td>blur</td>
          <td>Emitted when the select loses focus.</td>
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
          <td>chip</td>
          <td>Used to customize the appearance of selected chips in multiple selection mode.</td>
          <td>option</td>
        </tr>
        <tr>
          <td>aggregator</td>
          <td>Used to customize the appearance of the aggregator, which shows the number of hidden chips in multiple selection mode.</td>
          <td>options</td>
        </tr>
        <tr>
          <td>placeholder</td>
          <td>Used to customize the appearance of the placeholder text when no options are selected.</td>
          <td>None</td>
        </tr>
        <tr>
          <td>option</td>
          <td>Used to customize the appearance of the options in the dropdown list.</td>
          <td>option</td>
        </tr>
      </tbody>
    </table>

    <pre><code>&lt;UiSelect
  :options="[{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}]"
  v-model="selectedOption"
  placeholder="Select an option"
/&gt;

&lt;UiSelect
  :options="[{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}]"
  multiple
  v-model="selectedOptions"
  placeholder="Select options"
&gt;
  &lt;template #chip="{ option }"&gt;
    &lt;span class="custom-chip"&gt;{ { option.text } }&lt;/span&gt;
  &lt;/template&gt;
&lt;/UiSelect&gt;
</code></pre>

    <UiSelect
      v-model="selectedOption"
      :options="[{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}]"
      placeholder="Select an option"
    />

    <UiSelect
      v-model="selectedOptions"
      :options="[{value: 1, text: 'Option 1'}, {value: 2, text: 'Option 2'}]"
      multiple
      placeholder="Select options"
    >
      <template #chip="{ option }">
        <span class="custom-chip">{{ option.text }}</span>
      </template>
    </UiSelect>
  </div>
</template>