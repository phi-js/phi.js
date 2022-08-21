<script setup>
import { UiOutput } from '.'

const examples = [
  { value: 'Hola' },

  { value: 'santiago@phi.co', type: 'email' },

  { value: 1500 },
  { value: 1500, type: 'currency' },
  { value: 1500, type: 'currency', format: 'EUR' },
  { value: 1500, type: 'currency', format: 'MXN' },
  { value: 1500, type: 'currency', format: 'COP' },

  {
    value: [
      'santiago@phi.co',
      'juan@phi.co',
    ],
    type: 'array',
    items: { type: 'email' },
  },

  // items shorthand
  {
    value: [
      'santiago@phi.co',
      'juan@phi.co',
    ],
    type: 'array',
    items: 'email',
  },

  { value: '2022-08-18' },
  { value: '2022-08-18', type: 'date' },
  // { value: '2022-08-18', type: 'date', format: 'day' },
  {
    value: '2022-08-18',
    type: 'date',
    format: { // Valor de OPTIONS a pasar a toLocaleString
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
  },

  { value: '1660845034' },
  { value: '1660845034', type: 'date' },
  { value: '1660845034', type: 'date', format: 'day' },

  { value: 1660845034 },
  { value: 1660845034, type: 'date' },
  { value: 1660845034, type: 'date', format: 'day' },

  { value: true },
  { value: true, type: 'boolean' },
  {
    value: true,
    type: 'boolean',
    oneOf: [
      { const: true, title: 'Oh yeah' },
      { const: false, title: 'oh no' },
    ],
  },

  { value: false },
  { value: false, type: 'boolean' },
  {
    value: false,
    type: 'boolean',
    oneOf: [
      { const: true, title: 'Oh yeah' },
      { const: false, title: 'oh no' },
    ],
  },

  {
    value: { lat: 0, lng: 0 },
    type: 'geo',
    format: 'link', // link, map, ... ?
  },

  {
    value: [
      { lat: 0, lng: 0 },
      { lat: 1000, lng: 1000 },
      { lat: -1000, lng: -1000 },
      { lat: 40.4217261, lng: -3.7107758 },
    ],
    type: 'array',
    items: 'geo',
  },

  // JSON Schema borrowed props:

  // oneOf
  {
    value: 0,
    oneOf: [
      { const: '0', title: 'Female' },
      { const: '1', title: 'Male' },
    ],
  },
  {
    value: 1,
    oneOf: [
      { const: '0', title: 'Female' },
      { const: '1', title: 'Male' },
    ],
  },
  {
    value: 2,
    oneOf: [
      { const: '0', title: 'Female' },
      { const: '1', title: 'Male' },
    ],
  },
  {
    value: 'foo',
    oneOf: [
      { const: '0', title: 'Female' },
      { const: '1', title: 'Male' },
    ],
  },


  // Arrays
  {
    value: ['a', 'c'],
    type: 'array',
  },

  {
    value: ['c', 'a', 'c', 'a'],
    type: 'array',
    items: {
      type: 'string',
      oneOf: [
        { const: 'a', title: 'Letra A' },
        { const: 'b', title: 'Letra B' },
        { const: 'c', title: 'Letra C' },
      ],
    },
  },
]

</script>

<template>
  <div class="UiOutput-docs">
    <h1>UiOutput</h1>

    <table border="1">
      <thead>
        <tr>
          <th>Props</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(example, i) in examples"
          :key="i"
        >
          <td><pre><code>{{ example }}</code></pre></td>
          <td valign="top">
            <UiOutput
              v-bind="example"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>