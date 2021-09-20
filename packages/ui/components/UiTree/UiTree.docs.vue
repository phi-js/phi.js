<script setup>
const tree = [
  {
    text: 'Un elemento',
    subtext: 'Un subtexto',
    children: [
      {
        text: 'Hijo 1',
        children: [{ text: 'Hijo 1' }, { text: 'Hijo 2' }, { text: 'Hijo 3' }]
      },
      {
        text: 'Hijo 2',
        children: [
          { text: 'Hijo 1' },
          {
            text: 'Hijo 2',
            children: [
              { text: 'Hijo 1' },
              { text: 'Hijo 2' },
              { text: 'Hijo 3' }
            ]
          },
          { text: 'Hijo 3' }
        ]
      },
      {
        text: 'Hijo 3',
        children: [{ text: 'Hijo 1' }, { text: 'Hijo 2' }, { text: 'Hijo 3' }]
      }
    ]
  },
  {
    text: 'Otro elemento',
    subtext: 'Otro subtexto (sin hijos)'
  },
  {
    text: 'Otro elemento',
    subtext: 'Otro subtexto',
    children: [
      { text: 'Hijo 1' },
      {
        text: 'Hijo 2',
        children: [
          { text: 'Hijo 1' },
          { text: 'Hijo 2' },
          {
            text: 'Hijo 3',
            children: [
              { text: 'Hijo 1' },
              { text: 'Hijo 2' },
              { text: 'Hijo 3' }
            ]
          }
        ]
      },
      { text: 'Hijo 3' }
    ]
  }
]

import { UiTree } from './index.js'
</script>

<template>
  <h1>UiTree</h1>
  <UiTree :value="tree" style="max-width: 300px" />
</template>
