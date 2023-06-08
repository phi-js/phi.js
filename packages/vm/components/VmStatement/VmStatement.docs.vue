<script setup>
import { ref } from 'vue'
import { VmStatement } from '@/packages/vm'

const fields = [
  {
    value: '$.prop1',
    type: 'string',
    text: 'Propiedad 1',
  },
  {
    value: '$.color',
    type: 'string',
    text: 'Color favorito',
    enum: [
      { value: 'am', text: 'Amarillo' },
      { value: 'az', text: 'Azul' },
      { value: 'ro', text: 'Rojo' },
    ],
  },
]

const stmt = ref({
  chain: [
    {
      assign: 'personas',
      stmt: {
        call: 'fetch',
        args: null,
      },
      info: {
        text: 'API: Obtener personas',
        icon: 'mdi:api',
      },
    },
    {
      if: {
        or: [
          {
            op: 'string.same',
            field: 'perro',
            args: 'gato',
            info: {
              text: '',
              icon: '',
            },
          },
        ],
      },
      then: null,
      else: null,
      info: {
        text: 'Si se cumple ....',
        icon: 'mdi:directions-fork',
      },
    },
  ],
})
</script>

<template>
  <div class="VmStatement-docs">
    <h1>VmStatement</h1>

    <VmStatement
      v-model="stmt"
      :fields="fields"
    />
    <pre>stmt: {{ stmt }}</pre>
  </div>
</template>

<style lang="scss">
.VmStatement-docs {
  max-width: 600px;
}
</style>