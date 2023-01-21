<script setup>
import { ref, computed } from 'vue'
import { getProperty } from '../../helpers'
import { columns as sampleColumns, records } from './samples'

import UiDataTable from './UiDataTable.vue'

const columns = ref(sampleColumns)

const order = ref([
  { field: '$.id', desc: false },
])

const sortedRecords = computed(() => {
  if (!order.value.length) {
    return records
  }

  return records.concat().sort((a, b) => {
    for (let i = 0; i < order.value.length; i++) {
      const curOrder = order.value[i]
      const valueA = getProperty(a, curOrder.field)
      const valueB = getProperty(b, curOrder.field)

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

    <p>Este componente muestra un arreglo de objetos JSON arbitrarios en una tabla</p>
    <p>Permitiendo especificar una lista de columnas a mostrar, y un componente asociado para mostrar el valor de la columna</p>


    <section>
      <h2>Props</h2>
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

  // Caso general: mostrar un dato con UiOutput
  {
    title: 'User ID',       // Titulo a mostrar en el encabezado
    value: '$.person.bday', // JSONPath hacia el valor del RECORD a mostrar en la columna
    type: 'date',           // Tipo de output (propiedad enviada a &lt;UiOutput type="...")
    format: 'day'           // Opcional. Propiedad "format" de &lt;UiOutput
  },

  // Componente custom
  {
    title: 'User',
    component: 'MyPerson',
    props: {
      formal: false,
      firstName: '$.person.firstName',
      lastName: '$.person.lastName',
      gender: '$.person.gender',
      avatar: '$.person.avatar',
    }
  }

  // Arrays de datos
  {
    title: 'Opciones',
    value: '$.listaDeEmails'
    type: 'array',
    items: {
      type: 'email'
    }
  }

  // Componente custom en array de datos
  {
    title: 'Sesiones',
    value: '$.listaDeSesiones',
    type: 'array',
    items: {
      component: 'MySession',
      props: (item, record) => ({
        long: true,
        start: item.start,
        end: item.end,
        name: item.name
      })
    }
  }
  ...
]
        </pre>
        </li>
      </ul>
    </section>

    <ul>
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