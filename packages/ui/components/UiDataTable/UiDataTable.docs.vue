<script setup>
import { ref, computed } from 'vue'
import { getProperty } from '../../helpers'
import { columns as sampleColumns, records } from './samples'

import UiInput from '../UiInput/UiInput.vue'
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
  <div class="Docs">
    <h1>UiDataTable</h1>
    <code>import { UiDataTable } from '@/packages/ui'</code>
    <p>
      UiDataTable is a powerful and flexible table component that supports large datasets, column sorting, column reordering, column hiding, and more. It also includes a toolbar for additional actions and customization.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>records</td>
          <td>Array of arbitrary JSON objects</td>
          <td>Array</td>
          <td>false</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>columns</td>
          <td>Array of available columns</td>
          <td>Array</td>
          <td>false</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>order</td>
          <td>Array of objects representing the order of columns</td>
          <td>Array</td>
          <td>false</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>isLoading</td>
          <td>Indicates if the table is in a loading state</td>
          <td>Boolean</td>
          <td>false</td>
          <td>false</td>
        </tr>
        <tr>
          <td>maxTds</td>
          <td>Maximum number of visible table cells</td>
          <td>String, Number</td>
          <td>false</td>
          <td>200</td>
        </tr>
        <tr>
          <td>pointer</td>
          <td>Starting index of the visible window</td>
          <td>Number</td>
          <td>false</td>
          <td>0</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>click-record</td>
          <td>Emitted when a record in the table is clicked</td>
        </tr>
        <tr>
          <td>update:order</td>
          <td>Emitted when the order of columns is updated</td>
        </tr>
        <tr>
          <td>update:pointer</td>
          <td>Emitted when the starting index of the visible window is updated</td>
        </tr>
        <tr>
          <td>scroll-bottom</td>
          <td>Emitted when the table is scrolled to the bottom</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>toolbar</td>
          <td>Slot for adding custom elements to the toolbar</td>
          <td>-</td>
        </tr>
        <tr>
          <td>column-icons</td>
          <td>Slot for adding custom icons to the column headers</td>
          <td>column</td>
        </tr>
        <tr>
          <td>column-popup</td>
          <td>Slot for adding custom options to the column dropdown menu</td>
          <td>column, close</td>
        </tr>
      </tbody>
    </table>
    <!--
    <pre><code>
&lt;UiDataTable
  :records="records"
  :columns="columns"
  :order="order"
  :isLoading="isLoading"
  :maxTds="maxTds"
  :pointer="pointer"
  @click-record="handleClickRecord"
  @update:order="handleUpdateOrder"
  @update:pointer="handleUpdatePointer"
  @scroll-bottom="handleScrollBottom"
/&gt;
</code></pre>

    <UiDataTable
      :records="records"
      :columns="columns"
      :order="order"
      :is-loading="isLoading"
      :max-tds="maxTds"
      :pointer="pointer"
      @click-record="handleClickRecord"
      @update:order="handleUpdateOrder"
      @update:pointer="handleUpdatePointer"
      @scroll-bottom="handleScrollBottom"
    /> -->






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
      <UiInput
        v-model="columns"
        type="json"
        label="columns"
      />
    </section>
  </details>

  <details>
    <summary>Order</summary>
    <section>
      <UiInput
        v-model="order"
        type="json"
        label="order"
      />
    </section>
  </details>

  <UiDataTable
    v-model:columns="columns"
    v-model:order="order"
    :records="sortedRecords"
  />
</template>