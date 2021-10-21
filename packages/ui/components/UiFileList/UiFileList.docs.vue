<script setup>
import { ref } from 'vue'
import UiFileList from './UiFileList.vue'
import { UiUpload } from '../UiUpload'

// const files = ref([])
const files = ref([
  {
    id: 'odzvc02sfxz',
    path: '/cms/pages/test',
    name: 'Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    size: '29050',
    mimetype: 'image/jpeg',
    timestamp: '1615566175',
    url: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    preview: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.preview.jpg',
    thumbnail: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.thumbnail.jpg',
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
])

const testUrl = ref('http://v4.local/1/cms/pages/test/files')
</script>

<template>
  <h1>UiFileList</h1>

  <UiFileList :files="files" />
  <hr>

  <UiFileList
    :files="files"
    view="gallery"
  />
  <hr>

  <UiUpload
    v-model="files"
    :endpoint="testUrl"
    inline
    multiple
  />
  <hr>

  <pre>files: {{ files }}</pre>
</template>