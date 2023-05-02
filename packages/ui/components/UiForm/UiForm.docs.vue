<script setup>
import { ref } from 'vue'
import { UiForm } from '.'

const formData = ref({})

const model = ref({
  text: 'text',
  secondary: 'secondary',
  name: 'name',
  size: 10,
  mimetype: 'application/json',
  color: 2,
  colors: [3, 1],
})

const fields = [
  {
    type: 'text',
    label: 'Título',
    model: '$.text',
  },
  {
    type: 'text',
    label: 'Descripción',
    model: '$.secondary',
  },
  {
    type: 'static',
    label: 'Nombre',
    model: '$.name',
  },
  {
    type: 'number',
    label: 'Tamaño',
    model: '$.size',
  },
  {
    type: 'static',
    label: 'Tipo',
    model: '$.mimetype',
  },
  {
    type: 'select',
    label: 'Color',
    model: '$.color',
    placeholder: 'Escoge un color',
    options: [
      { text: 'Uno', value: 1 },
      { text: 'Dos', value: 2 },
      { text: 'Tres', value: 3 },
    ],
  },
  {
    type: 'select',
    label: 'Colores',
    model: '$.colors',
    placeholder: 'Escoge varios colores',
    multiple: true,
    options: [
      { text: 'Uno', value: 1 },
      { text: 'Dos', value: 2 },
      { text: 'Tres', value: 3 },
    ],
  },
]
</script>

<template>
  <div class="Docs">
    <h1>UiForm</h1>
    <code>import { UiForm } from '@/packages/ui'</code>
    <p>
      The UiForm component is used to create a form with input fields. It accepts an array of fields and can be used with v-model to bind the form data to a parent component.
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
          <td>The value of the form data. Can be used with v-model to bind the form data to a parent component.</td>
          <td>Any</td>
          <td>No</td>
          <td>null</td>
        </tr>
        <tr>
          <td>fields</td>
          <td>
            An array of field objects, each representing an input field in the form. Each field object should have the following properties:
            <ul>
              <li><strong>label</strong>: The label for the input field.</li>
              <li><strong>name</strong>: The name of the input field.</li>
              <li><strong>type</strong>: The type of the input field (eg. text, password, etc.)</li>
              <li><strong>placeholder</strong>: The placeholder text for the input field.</li>
              <li><strong>model</strong>: The name of the property in the form data that this field is bound to.</li>
              <li><strong>rules</strong>: An array of functions that validate the input field.</li>
            </ul>
          </td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
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
          <td>Emitted when the form data is updated. Can be used with v-model to bind the form data to a parent component.</td>
        </tr>
      </tbody>
    </table>



    <h2>Examples</h2>

    <h3>Example 1: Basic usage</h3>
    <pre><code>
&lt;UiForm :fields="[
  { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email', model: 'email' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password', model: 'password' },
]" v-model="formData" /&gt;
</code></pre>

    <UiForm
      v-model="formData"
      :fields="[
        { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email', model: 'email' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password', model: 'password' },
      ]"
    />

    <h3>Example 2: Custom validation rules</h3>
    <pre><code>
&lt;UiForm :fields="[
  { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email', model: 'email', rules: [v =&gt; !!v || 'Email is required', v =&gt; /.+@.+/.test(v) || 'Email must be valid'] },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password', model: 'password', rules: [v =&gt; !!v || 'Password is required', v =&gt; v.length &gt;= 8 || 'Password must be at least 8 characters'] },
]" v-model="formData" /&gt;
</code></pre>

    <UiForm
      v-model="formData"
      :fields="[
        { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter your email', model: 'email', rules: [v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'Email must be valid'] },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter your password', model: 'password', rules: [v => !!v || 'Password is required', v => v.length >= 8 || 'Password must be at least 8 characters'] },
      ]"
    />


    <hr>
    <UiForm
      v-model="model"
      :fields="fields"
    />
    <pre>model: {{ model }}</pre>
  </div>
</template>