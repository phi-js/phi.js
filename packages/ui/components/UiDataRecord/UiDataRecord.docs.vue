<script setup>
import UiDataRecord from './UiDataRecord.vue'

</script>

<template>
  <div class="Docs">
    <h1>UiDataRecord</h1>
    <code>import { UiDataRecord } from '@/packages/ui'</code>
    <p>A component that displays a JSON object as a set of labeled fields. It supports nested objects, and allows you to specify which fields to display.</p>

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
          <td>value</td>
          <td>The object to display. Must be a JSON object.</td>
          <td>Object</td>
          <td>Yes</td>
          <td>-</td>
        </tr>
        <tr>
          <td>fields</td>
          <td>
            An array of fields to display. Each field is an object with the following properties:
            <ul>
              <li><strong>title</strong>: The label for the field.</li>
              <li><strong>value</strong>: The path to the value within the object. Use dot-notation for nested properties (e.g. <strong>person.name.first</strong>).</li>
              <li><strong>format</strong>: A formatting function to apply to the value. The function should accept the value as input and return a formatted string.</li>
              <li><strong>children</strong>: An array of child fields. Use this to create nested groups of fields.</li>
              <li><strong>open</strong>: Whether the group is open or closed. Only applies if the field has children.</li>
            </ul>
          </td>
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
          <td>N/A</td>
          <td>N/A</td>
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
          <td>N/A</td>
          <td>N/A</td>
          <td>N/A</td>
        </tr>
      </tbody>
    </table>

    <h2>Examples</h2>

    <h3>Example 1: Displaying all fields</h3>

    <pre><code>&lt;UiDataRecord :value="{
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  }
}" :fields="[
  { title: 'Name', value: 'name' },
  { title: 'Age', value: 'age' },
  { title: 'Street', value: 'address.street' },
  { title: 'City', value: 'address.city' },
  { title: 'State', value: 'address.state' },
  { title: 'Zip', value: 'address.zip' },
]" /&gt;</code></pre>

    <UiDataRecord
      :value="{
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        }
      }"
      :fields="[
        { title: 'Name', value: 'name' },
        { title: 'Age', value: 'age' },
        { title: 'Street', value: 'address.street' },
        { title: 'City', value: 'address.city' },
        { title: 'State', value: 'address.state' },
        { title: 'Zip', value: 'address.zip' },
      ]"
    />

    <h3>Example 2: Displaying selected fields</h3>

    <pre><code>&lt;UiDataRecord :value="{
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  }
}" :fields="[
  { title: 'Name', value: 'name' },
  { title: 'Street', value: 'address.street' },
  { title: 'Zip', value: 'address.zip' },
]" /&gt;</code></pre>

    <UiDataRecord
      :value="{
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        }
      }"
      :fields="[
        { title: 'Name', value: 'name' },
        { title: 'Street', value: 'address.street' },
        { title: 'Zip', value: 'address.zip' },
      ]"
    />

    <h3>Example 3: Displaying nested fields</h3>

    <pre><code>&lt;UiDataRecord :value="{
  name: 'John',
  age: 30,
  address: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  },
  phone: {
    home: '555-1234',
    work: '555-5678'
  }
}" :fields="[
  { title: 'Name', value: 'name' },
  { title: 'Address', children: [
    { title: 'Street', value: 'address.street' },
    { title: 'City', value: 'address.city' },
    { title: 'State', value: 'address.state' },
    { title: 'Zip', value: 'address.zip' },
  ]},
  { title: 'Phone', children: [
    { title: 'Home', value: 'phone.home' },
    { title: 'Work', value: 'phone.work' },
  ]}
]" /&gt;</code></pre>

    <UiDataRecord
      :value="{
        name: 'John',
        age: 30,
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zip: '12345'
        },
        phone: {
          home: '555-1234',
          work: '555-5678'
        }
      }"
      :fields="[
        { title: 'Name', value: 'name' },
        { title: 'Address', children: [
          { title: 'Street', value: 'address.street' },
          { title: 'City', value: 'address.city' },
          { title: 'State', value: 'address.state' },
          { title: 'Zip', value: 'address.zip' },
        ]},
        { title: 'Phone', children: [
          { title: 'Home', value: 'phone.home' },
          { title: 'Work', value: 'phone.work' },
        ]}
      ]"
    />
  </div>
</template>