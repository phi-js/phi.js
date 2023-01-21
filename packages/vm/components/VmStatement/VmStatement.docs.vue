<script setup>
import { ref } from 'vue'
import VmStatement from './VmStatement.vue'
import { UiInput } from '../../../ui/components'

const _stmt = ref({
  chain: [
    {
      info: { text: 'Hacer la cosa 1' },
      do: { call: 'console.log', args: 'Hola mundo' },
    },
  ],
})

const stmt = ref(null)

const schema = {
  type: 'object',
  properties: {
    yousuck: {
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
      type: 'string',
      text: 'Color favorito',
      enum: [
        {
          value: 'am',
          text: 'Amarillo',
        },
        {
          value: 'az',
          text: 'Azul',
        },
        {
          value: 'ro',
          text: 'Rojo',
        },
      ],
    },
    child: {
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
          type: 'string',
          text: 'Color favorito',
          enum: [
            {
              value: 'am',
              text: 'Amarillo',
            },
            {
              value: 'az',
              text: 'Azul',
            },
            {
              value: 'ro',
              text: 'Rojo',
            },
          ],
        },
      },
    },
  },
}
</script>

<template>
  <div class="UiGroup">
    <UiInput
      v-model="stmt"
      label="Stmt"
      type="json"
    />
    <UiInput
      v-model="schema"
      label="schema"
      type="json"
    />
  </div>
  <hr>

  <VmStatement
    v-model="stmt"
    :model-schema="schema"
    :default="{and:[]}"
  />
  <pre>stmt: {{ stmt }}</pre>
</template>
