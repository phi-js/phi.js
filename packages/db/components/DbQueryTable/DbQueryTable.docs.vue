<script setup>
import { ref } from 'vue'

import DbQueryTable from './DbQueryTable.vue'
import { records, schema } from '../../samples'


const query = ref()
const columns = ref()

</script>

<template>
  <div class="DbQueryTable-docs">
    <h1>DbQueryTable</h1>

    <section>
      <p>Este es un componente <strong>bruto</strong> que sirve para editar (via v-model):</p>
      <ul>
        <li><strong>query</strong> Un objeto QUERY.  Se modifican su "where", "limit" y "order"</li>
        <li><strong>columns</strong> Arreglo de columnas</li>
      </ul>
    </section>

    <section>
      <p>Recibe las siguientes <strong>props</strong></p>
      <ul>
        <li><strong>records</strong> Arreglo de objetos JSON a mostrar en la tabla</li>
        <li><strong>schema</strong> JSON schema que describe la estructura de los elementos de <strong>records</strong></li>
      </ul>
    </section>

    <section>
      <p>El componente despliega una tabla con los registros y columnas especificados, y elementos para editar el query (filtros, order, limit)</p>
    </section>

    <!-- <pre>columns: {{ columns }}</pre> -->
    <pre>query: {{ query }}</pre>

    <DbQueryTable
      v-model:query="query"
      v-model:columns="columns"
      :records="records"
      :schema="schema"
    />
  </div>
</template>