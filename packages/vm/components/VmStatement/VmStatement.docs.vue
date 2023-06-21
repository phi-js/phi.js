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
          {
            op: 'enum.any',
            field: '$.color',
            args: [
              'am',
              'az',
              'ro',
            ],
            info: {
              text: '',
              icon: '',
            },
          },
        ],
      },
      then: {
        chain: [
          {
            assign: '',
            stmt: { eval: '' },
            info: {
              text: 'Javascript',
              icon: 'mdi:language-javascript',
            },
          },
          {
            assign: '',
            stmt: null,
            info: {
              text: 'Asignar variable',
              icon: 'mdi:variable',
            },
          },
        ],
      },
      else: null,
      info: {
        text: 'Si se cumple ....',
        icon: 'mdi:directions-fork',
      },
    },
    {
      assign: 'uno',
      stmt: {
        call: 'window.alert',
        args: null,
      },
      info: {
        text: 'Alertar',
        icon: 'mdi:window-maximize',
      },
    },
    {
      assign: 'dos',
      stmt: {
        call: 'window.confirm',
        args: null,
      },
      info: {
        text: 'Pedir confirmación',
        icon: 'mdi:window-maximize',
      },
    },
    {
      assign: 'tres',
      stmt: {
        call: 'window.prompt',
        args: null,
      },
      info: {
        text: 'Introducir texto',
        icon: 'mdi:window-maximize',
      },
    },
    {
      assign: 'cuatro',
      stmt: {
        call: 'console.log',
        args: null,
      },
      info: {
        text: 'Mostrar en consola',
        icon: 'mdi:window-maximize',
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
      class="UiCodeContainer"
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