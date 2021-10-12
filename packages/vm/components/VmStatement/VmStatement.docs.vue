<script setup>
import { ref } from 'vue'
import VmStatement from './VmStatement.vue'
import { UiInput } from '../../../ui/components'

const stmt = ref({
  chain: [
    {
      info: { text: 'Hacer la cosa 1' },
      do: { call: 'console.log', args: 'Hola mundo' },
    },
  ],
})

const schema = {
  type: 'object',
  properties: {
    one: {
      type: 'string',
      text: 'Propiedad I',
    },

    two: { type: 'string' },

    personId: {
      type: 'person',
      text: 'Estudiante',
    },

    date: { type: 'date' },

    color: {
      type: 'text',
      text: 'Color favorito',
      enum: [
        { value: 'am', text: 'Amarillo' },
        { value: 'az', text: 'Azul' },
        { value: 'ro', text: 'Rojo' },
      ],
    },
  },
}
</script>

<template>
  <UiInput
    v-model="stmt"
    type="json"
  />

  <VmStatement
    v-model="stmt"
    :model-schema="schema"
  />
  <pre>stmt: {{ stmt }}</pre>
</template>
