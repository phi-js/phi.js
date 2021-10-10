<script setup>
import { ref } from 'vue'
import VmStatement from './VmStatement.vue'

const stmt = ref({ and: [] })

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
  <VmStatement
    v-model="stmt"
    :model-schema="schema"
  />
  <pre>stmt: {{ stmt }}</pre>
</template>
