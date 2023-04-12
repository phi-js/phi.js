<script setup>
import { ref } from 'vue'
import { UiUpload } from '.'

const one = ref()

const many = ref([
  {
    id: 'otvq0lf633s',
    path: '/cms/pages/test',
    name: 'de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg',
    size: '1050479',
    mimetype: 'image/jpeg',
    timestamp: '1619023947',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/de4s4m4-55703bed-438a-4993-9eb3-a14a3f547a69.jpg.thumbnail.jpg',
  },
  {
    id: 'oe0z03mcq1f',
    path: '/cms/pages/test',
    name: 'ciudad-de-sofia-antiguo-imperio-otomano.jpg',
    size: '91704',
    mimetype: 'image/jpeg',
    timestamp: '1615572838',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/ciudad-de-sofia-antiguo-imperio-otomano.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/ciudad-de-sofia-antiguo-imperio-otomano.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/ciudad-de-sofia-antiguo-imperio-otomano.jpg.thumbnail.jpg',
  },
])

</script>

<template>
  <h1>UiUpload</h1>

  <hr>

  Single:
  <UiUpload
    v-model="one"
    endpoint="http://v4.local/1/cms/pages/test/files"
    :aspect-ratio="120/160"
  />

  <hr>

  Single (inline):
  <UiUpload
    v-model="one"
    inline
    endpoint="http://v4.local/1/cms/pages/test/files"
  />
  <pre>one: {{ one }}</pre>

  <hr>

  Many:
  <UiUpload
    v-model="many"
    multiple
    endpoint="http://v4.local/1/cms/pages/test/files"
  />
  <pre>many: {{ many }}</pre>
</template>