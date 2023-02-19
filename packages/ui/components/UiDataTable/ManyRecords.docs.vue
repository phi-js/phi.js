<script setup>
import { onMounted, ref } from 'vue'
import UiDataTable from './UiDataTable.vue'

const isLoading = ref(false)
const records = ref([])

onMounted(async () => {
  isLoading.value = true
  records.value = await fetch('https://jsonplaceholder.typicode.com/photos?_limit=300')
    .then((r) => r.json())

  isLoading.value = false
})

const columns = [
  {
    title: 'ID',
    value: '$.id',
  },
  {
    title: 'Title',
    value: '$.title',
  },
  {
    title: 'URL',
    value: '$.url',
    type: 'url',
  },
  {
    title: 'Thumbnail',
    value: '$.thumbnailUrl',
    type: 'url',
  },
  {
    title: 'Album ID',
    value: '$.albumId',
  },
]
</script>

<template>
  <div class="UiDataTable-docs">
    <h1>Thousands of records</h1>
    <small>{{ records.length }}</small>
    <UiDataTable
      :records="records"
      :columns="columns"
      :is-loading="isLoading"
      style="max-height: 80vh"
    />
  </div>
</template>