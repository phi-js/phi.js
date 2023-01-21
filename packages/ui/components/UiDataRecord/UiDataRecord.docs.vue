<script setup>
import UiDataRecord from './UiDataRecord.vue'

import sampleValue from './sample-value.js'

import CustomComponent from './CustomComponent.vue'

const fields = [
  {
    title: 'ID',
    value: '$.id',
  },
  {
    title: 'Date created',
    value: '$.dateCreated',
    type: 'date',
  },

  {
    title: 'Hey! a group!',
    children: [
      {
        title: 'Opciones de cafetería',
        value: '$.canteenDiaeten',
      },

      {
        title: 'And a SUB group :)',
        children: [
          {
            title: 'Opciones de cafetería',
            value: '$.canteenDiaeten',
            type: 'array',
            items: {
              type: 'enum',
              options: [
                { value: 'foo', text: 'Some Foo' },
                { value: 'vegetarian', text: 'Algo vegetariano' },
                { value: 'no_allergies', text: 'Allergies stuff' },
                { value: 'no_fish', text: 'No le des pescado' },
              ],
            },
          },
        ],
      },

      {
        title: 'Opciones de cafetería',
        value: '$.canteenDiaeten',
        type: 'array',
        items: {
          type: 'enum',
          options: [
            { value: 'foo', text: 'Some Foo' },
            { value: 'vegetarian', text: 'Algo vegetariano' },
            { value: 'no_allergies', text: 'Allergies stuff' },
            { value: 'no_fish', text: 'No le des pescado' },
          ],
        },
      },
    ],
  },

  {
    title: 'Opciones de cafetería',
    value: '$.canteenDiaeten',
  },
  {
    title: 'Opciones de cafetería',
    value: '$.canteenDiaeten',
    type: 'array',
    items: {
      type: 'enum',
      options: [
        { value: 'foo', text: 'Some Foo' },
        { value: 'vegetarian', text: 'Algo vegetariano' },
        { value: 'no_allergies', text: 'Allergies stuff' },
        { value: 'no_fish', text: 'No le des pescado' },
      ],
    },
  },
  {
    title: 'Foto',
    value: '$.foto',
    type: 'array',
    items: { type: 'upload' },
  },
  {
    title: 'Archivo subido 1',
    value: '$.notfallbogenUpload',
    type: 'array',
    items: { type: 'upload' },
  },
  {
    title: 'Autor',
    value: '$.objAuthor',
  },
  {
    title: 'Autor',
    value: '$.objAuthor',
    component: CustomComponent,
    props: { formal: false, subtext: 'Esto es fijo' },
  },
]
</script>

<template>
  <div class="UiDataRecord-docs">
    <h1>UiDataRecord</h1>
    <p>Este componente muestra un objeto arbitario JSON como una lista de campos etiqueta:valor</p>
    <p>Usando la misma definicion de "columns" que usa <a href="/#/packages/ui/components/UiDataTable/UiDataTable.docs.vue">UiDataTable</a> para definir la lista y valor de los campos a mostrar</p>

    <section>
      <h2>Props</h2>
      <ul>
        <li>
          <strong>value:</strong>
          Objeto JSON arbitrario

          <details>
            <summary>Ejemplo</summary>
            <pre>value: {{ sampleValue }}</pre>
          </details>
        </li>

        <li>
          <strong>fields:</strong>
          Un arreglo describiendo los campos a mostrar

          <details>
            <summary>Ejemplo</summary>
            <pre>fields: {{ fields }}</pre>
          </details>
        </li>
      </ul>
    </section>

    <UiDataRecord
      :value="sampleValue"
      :fields="fields"
    />
  </div>
</template>