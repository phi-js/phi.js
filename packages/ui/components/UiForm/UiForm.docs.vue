<script setup>
import { ref } from 'vue'
import { UiForm } from '.'

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
  <UiForm
    v-model="model"
    :fields="fields"
  />
  <pre>model: {{ model }}</pre>
</template>