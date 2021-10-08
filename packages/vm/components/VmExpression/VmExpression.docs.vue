<script setup>
import { ref } from 'vue'
import { VmExpression } from '.'

const samples = ref([
  { and: [] },
])

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
  },
}
</script>

<template>
  <VmExpression
    v-model="samples[0]"
    :model-schema="schema"
  />

  <pre>{{ samples }}</pre>
</template>
