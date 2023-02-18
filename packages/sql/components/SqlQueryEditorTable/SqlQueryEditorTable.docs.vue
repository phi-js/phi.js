<script setup>
import { computed, ref } from 'vue'
import SqlQueryEditorTable from './SqlQueryEditorTable.vue'

const query = ref({
  select: {
    data: { $json_decode: 'record.data' },
    person: {
      id: 'person.id',
      type: 'person.type',
      firstname: 'person.firstname',
      lastname: 'person.lastname',
      gender: 'person.gender',
    },
    responsible: {
      id: 'responsible.id',
      firstname: 'responsible.firstname',
      lastname: 'responsible.lastname',
      gender: 'responsible.gender',
    },
  },
  from: {
    table: 'sophia_jsondb_bigtable_records',
    as: 'record',
  },
  join: [
    {
      type: 'INNER JOIN',
      table: 'sophia_people',
      as: 'person',
      on: 'person.id = record.data->>\'$.personId\'',
    },
    {
      type: 'INNER JOIN',
      table: 'sophia_people',
      as: 'responsible',
      on: 'responsible.id = record.data->>\'$.responsibleId\'',
    },
  ],
  where: null,
  order: [{
    field: 'record.data->>\'$.fecha\'',
    desc: true,
  }],
  limit: null,
})

const finalQuery = computed(() => {
  const baseCondition = {
    field: 'record.tableId',
    op: 'eq',
    args: 'salidas',
  }

  return {
    ...query.value,
    where: query.value.where
      ? { and: [baseCondition, query.value.where] }
      : baseCondition,
  }
})

const columns = [
  {
    title: 'Fecha',
    value: '$.data.fecha',
    type: 'date',
    format: { hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' },
    orderBy: 'record.data->>\'$.fecha\'',
    filter: {
      field: 'record.data->>\'$.fecha\'',
      op: 'date.between',
      args: [],
    },
  },
  {
    title: 'Responsable',
    value: '$.responsible',
    orderBy: 'CONCAT(responsible.lastname, responsible.firstname)',
    filter: {
      search: {
        fields: [
          'responsible.firstname',
          'responsible.lastname',
        ],
      },
    },
  },
  {
    title: 'Estudiante',
    value: '$.person',
    orderBy: 'CONCAT(person.lastname, person.firstname)',
    filter: {
      search: {
        fields: [
          'person.firstname',
          'person.lastname',
        ],
      },
    },
  },
  {
    title: 'Ruta',
    value: '$.data.ruta',
    orderBy: 'record.data->>\'$.ruta\'',
    filter: { search: { fields: ['record.data->>\'$.ruta\''] } },
  },
  {
    title: 'Persona que recoge',
    value: '$.data.nombre',
    orderBy: 'record.data->>\'$.nombre\'',
    filter: { search: { fields: ['record.data->>\'$.nombre\''] } },
  },
  {
    title: 'Parentesco',
    value: '$.data.parentesco',
    orderBy: 'record.data->>\'$.parentesco\'',
    filter: { search: { fields: ['record.data->>\'$.parentesco\''] } },
  },
  {
    title: 'Documento',
    value: '$.data.documento',
    orderBy: 'record.data->>\'$.documento\'',
    filter: { search: { fields: ['record.data->>\'$.documento\''] } },
  },
  {
    title: 'Motivo',
    value: '$.data.motivo',
    orderBy: 'record.data->>\'$.motivo\'',
    filter: { search: { fields: ['record.data->>\'$.motivo\''] } },
  },
  {
    title: 'Estado',
    value: '$.data.estado',
    field: 'record.data->>\'$.estado\'',
    orderBy: 'record.data->>\'$.estado\'',
    enum: [
      {
        text: 'Pendiente (null)',
        value: null,
      },
      {
        text: 'Pendiente (string)',
        value: '',
      },
      {
        text: 'Recogido',
        value: 'recogido',
      },
      {
        text: 'Novedad',
        value: 'novedad',
      },
    ],
    filter: {
      field: 'record.data->>\'$.estado\'',
      op: 'enum.any',
      args: [],
    },
  },
  {
    title: 'observaciones',
    value: '$.data.observaciones',
    orderBy: 'record.data->>\'$.observaciones\'',
    filter: { search: { fields: ['record.data->>\'$.observaciones\''] } },
  },
]
</script>

<template>
  <div class="SqlQueryEditorTable">
    <h1>SqlQueryEditorTable</h1>

    <pre>finalQuery: {{ finalQuery }}</pre>

    <SqlQueryEditorTable
      v-model="query"
      :columns="columns"
      :search-fields="[
        'person.firstname',
        'person.lastname',
        'responsible.firstname',
        'responsible.lastname',
        'record.data->>\'$.nombre\'',
        'record.data->>\'$.parentesco\'',
        'record.data->>\'$.documento\'',
        'record.data->>\'$.motivo\'',
        'record.data->>\'$.ruta\'',
      ]"
    />
  </div>
</template>