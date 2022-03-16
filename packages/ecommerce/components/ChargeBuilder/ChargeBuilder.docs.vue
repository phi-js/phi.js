<script setup>
/*
El componente ChargeBuilder recibe una propiedad BLUEPRINT

BLUEPRINT es un objeto que describe los items, valores maximos, restricciones
y demas informacion necesaria para construir un objeto CHARGE

BLUEPRINT:
{
  text: "Obligaciones por pagar",
  value: 15000,
  allowPartial: true,
  items: [   // puede contener una lista de "hijos" (blueprints).  Recursiva.
    { ... blueprint for item 1 ... }
    { ... blueprint for item 2 ... }
    { ... blueprint for item 3 ... }
  ],

  id: "uid para referenciar este item",
  requires: [ ... lista de IDs de items que son prerequisito para pagar este ...],
  currency: 'COP',
  step: 1000,  // valor del "step" para aumentar/restar valores con botones "+" y "-"
  min: 0,
  max: 2000
}
```
*/

import { ref } from 'vue'
import ChargeBuilder from './ChargeBuilder.vue'
import blueprint3 from './sample-blueprint'

const charge = ref()

const blueprint = ref({
  text: 'Cobro No. 1',
  value: 15000,
  data: {
    foo: 'foo'
  }
})

const blueprint2 = ref({
  text: 'Cobros pendientes',
  step: 100,
  currency: 'MXN',
  expanded: true,
  allowPartial: false,

  items: [
    {
      id: 'feb',
      text: 'Febrero #0001',
      value: 5000,
    },
    {
      id: 'mar',
      requires: ['feb'],
      text: 'Marzo #0001',
      value: 5000,
    },
    {
      id: 'abr',
      requires: ['mar'],
      text: 'Abril #0001',
      value: 5000,
      allowPartial: true
    },
  ]
})

</script>

<template>
  <ChargeBuilder v-model="charge" :blueprint="blueprint3" />
  <!-- <pre>charge: {{ charge }}</pre> -->
  <pre>blueprint3: {{ blueprint3 }}</pre>
</template>