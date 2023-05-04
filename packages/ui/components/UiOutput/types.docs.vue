<script setup>
import { UiOutput } from '.'

const examples = [
  { value: 'Hola' },

  { value: 'santiago@phi.co', type: 'email' },
  { value: 'santiago@phi.co', type: 'email', text: 'Enviar mail a Santiago' },

  { value: 1500 },
  { value: 1500, type: 'currency' },
  { value: 1500, type: 'currency', currency: 'EUR' },
  { value: 1500, type: 'currency', currency: 'MXN' },
  { value: 1500, type: 'currency', currency: 'COP' },

  { value: '2022-08-18' },
  { value: '2022-08-18', type: 'date' },

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

  {
    value: '2022-08-18',
    type: 'date',
    format: { year: 'numeric', month: 'long', day: 'numeric' },
  },

  {
    value: '2022-08-18',
    type: 'date',
    format: { month: 'long', day: 'numeric' },
  },


  { value: '2022-08-18', type: 'time' },
  { value: '2022-08-18', type: 'time', format: { hour: '2-digit' } },
  { value: '2022-08-18', type: 'time', format: { hour: '2-digit', minute: '2-digit' } },
  { value: '2022-08-18', type: 'time', format: { timeStyle: 'full' } },
  { value: '2022-08-18', type: 'time', format: { timeStyle: 'long' } },
  { value: '2022-08-18', type: 'time', format: { timeStyle: 'medium' } },
  { value: '2022-08-18', type: 'time', format: { timeStyle: 'short' } },

  { value: '2022-08-18', type: 'datetime' },
  { value: '2022-08-18', type: 'datetime', format: { timeStyle: 'long' } },
  { value: '2022-08-18', type: 'datetime', format: { hour: '2-digit', minute: '2-digit' } },

  { value: '1660845034' },
  { value: '1660845034', type: 'date' },
  { value: '1660845034', type: 'date', format: 'day' },
  { value: '1660845034', type: 'date', format: 'time' },

  { value: 1660845034 },
  { value: 1660845034, type: 'date' },
  { value: 1660845034, type: 'date', format: 'day' },

  { value: true },
  { value: true, type: 'boolean' },
  {
    value: true,
    type: 'enum',
    options: [
      { value: true, text: 'Oh yeah' },
      { value: false, text: 'oh no' },
    ],
  },

  { value: false },
  { value: false, type: 'boolean' },
  {
    value: false,
    type: 'enum',
    options: [
      { value: true, text: 'Oh yeah' },
      { value: false, text: 'oh no' },
    ],
  },

  {
    value: { lat: 0, lng: 0 },
    type: 'geo',
  },

  {
    value: { lat: 40.4185483, lng: -3.710289 },
    type: 'geo',
  },

  // enum
  {
    value: 0,
    type: 'enum',
    options: [
      { value: '0', text: 'Female' },
      { value: '1', text: 'Male' },
    ],
  },
  {
    value: 1,
    type: 'enum',
    options: [
      { value: '0', text: 'Female' },
      { value: '1', text: 'Male' },
    ],
  },
  {
    value: 2,
    type: 'enum',
    options: [
      { value: '0', text: 'Female' },
      { value: '1', text: 'Male' },
    ],
  },
  {
    value: 'foo',
    type: 'enum',
    options: [
      { value: '0', text: 'Female' },
      { value: '1', text: 'Male' },
    ],
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