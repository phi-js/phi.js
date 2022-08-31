<script setup>
import { ref, computed } from 'vue'
import { getProperty } from '../../helpers'
import { columns as sampleColumns, records } from './samples'

import UiDataTable from './UiDataTable.vue'

// import getSchemaColumns from './getSchemaColumns.js'
// const columns = ref(getSchemaColumns(schema))
const columns = ref(sampleColumns)

const order = ref([
  { value: '$.id', desc: false },
])

const sortedRecords = computed(() => {
  if (!order.value.length) {
    return records
  }

  return records.concat().sort((a, b) => {
    for (let i = 0; i < order.value.length; i++) {
      const curOrder = order.value[i]
      const valueA = getProperty(a, curOrder.value)
      const valueB = getProperty(b, curOrder.value)

      if (valueA > valueB) {
        return curOrder.desc ? -1 : 1
      }
      if (valueA < valueB) {
        return curOrder.desc ? 1 : -1
      }
    }
    return 0
  })
})
</script>

<template>
  <div class="UiDataTable-docs">
    <h1>UiDataTable</h1>

    <p>Este componente es una tabla -bruta- que recibe:</p>

    <ul>
      <li>
        <strong>records:</strong>
        An arreglo de objetos JSON arbitrarios
      </li>

      <li>
        <strong>columns:</strong>
        Un arreglo describiendo las columnas a mostrar
        <pre>
columns: [
  {
    value: '$.person.bday', // JSONPath hacia el valor del RECORD a mostrar en la columna
    title: 'User ID',       // Titulo a mostrar en el encabezado
    type: 'date',           // Tipo de output (propiedad enviada a &lt;UiOutput type="...")
    format: 'day'           // Opcional. Propiedad "format" de &lt;UiOutput
  },
  ...
]
        </pre>
      </li>

      <li>
        <strong>order:</strong>
        ARRAY indicando el orden actual de las columnas.  El orden de los elementos del arreglo determina la prioridad
        <pre>
order: [
  { value: '$.id', desc: true },
  { value: '$.record.question2', desc: false },
]
        </pre>
      </li>

      <li>Emite un evento scroll-bottom cuando se ha hecho scroll hasta el final</li>
    </ul>

    <section>
      <h2>Format</h2>
      <p>A cell value is rendered depending on the column's type and format.  If <strong>format</strong> can be:</p>

      <ul>
        <li>
          <strong>A String:</strong> one of the internally available formats:
          <small>(Rendered via UiOutput)</small>
          <p>url, link, email, date, image, (geo)location, upload, url, uri, uri-reference, iri, iri-reference</p>
        </li>
      </ul>
    </section>
  </div>

  <hr>

  <details>
    <summary>Columns</summary>
    <section>
      <pre><code>{{ columns }}</code></pre>
    </section>
  </details>

  <details>
    <summary>Order</summary>
    <section>
      <pre><code>{{ order }}</code></pre>
    </section>
  </details>

  <UiDataTable
    v-model:columns="columns"
    v-model:order="order"
    :records="sortedRecords"
  />
</template>

<style lang="scss">
.UiDataTable-docs {
  details {
    section {
      max-height: 500px;
      overflow: auto;
    }
  }
}
</style>