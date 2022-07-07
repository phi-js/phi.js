<script setup>
import { ref, computed } from 'vue'
import { getProperty } from '@/packages/ui/helpers'
import { schema, records } from '../../samples.js'

import DbDataTable from './DbDataTable.vue'
import getSchemaColumns from '../../helpers/getSchemaColumns.js'

const columns = ref(getSchemaColumns(schema))

const order = ref([
  { property: 'id', desc: false },
])

const sortedRecords = computed(() => {
  if (!order.value.length) {
    return records
  }

  return records.concat().sort((a, b) => {
    for (let i = 0; i < order.value.length; i++) {
      const curOrder = order.value[i]
      const valueA = getProperty(a, curOrder.property)
      const valueB = getProperty(b, curOrder.property)

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
  <div class="DbDataTable-docs">
    <h1>DbDataTable</h1>

    <p>
      Este componente es una tabla -bruta- que recibe un arreglo de registros
      y un JSON SCHEMA describiendo la estructura de los registros
    </p>

    <ul>
      <li>
        Administra el modelo "columns":
        (Lista de columnas a mostrar. Si esta vacio se muestran una columna por cada valor escalar del registro)
      </li>
      <li>
        Administra el modelo "order":
        (Muestra controles junto al titulo de cada columna para ordenar)
      </li>

      <li>Emite un evento scroll-bottom cuando se ha hecho scroll hasta el final</li>
    </ul>
  </div>

  <details>
    <summary>Schema</summary>
    <section>
      <pre><code>{{ schema }}</code></pre>
    </section>
  </details>

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

  <DbDataTable
    v-model:columns="columns"
    v-model:order="order"
    :records="sortedRecords"
  />
</template>

<style lang="scss">
.DbDataTable-docs {
  details {
    section {
      max-height: 500px;
      overflow: auto;
    }
  }
}
</style>