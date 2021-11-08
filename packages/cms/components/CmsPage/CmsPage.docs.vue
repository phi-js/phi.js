<script setup>
import { ref } from 'vue'
import { CmsPage } from './index.js'
import { UiInput } from '/packages/ui/components'
import * as samplePages from '../../samples'

const page = ref()

const availablePages = ref(Object.keys(samplePages).map((pageName) => ({
  text: `Page ${pageName}`,
  value: pageName,
})))

function pickPage(pageName) {
  page.value = samplePages[pageName]
}

const model = ref({
  limit: 2,
  nombre: 'Santiago',
  cantidad: 1,
  palabras: 120,
  foo: {
    nombre: 'n',
    apellido: 'a',
  },
  image: {
    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    width: 'auto',
    href: 'https://phidias.co',
  },
})
</script>

<template>
  <div class="docs-page">
    <UiInput
      type="select-native"
      label="Page"
      :options="availablePages"
      placeholder="Seleccionar pagina"
      @update:modelValue="pickPage($event)"
    />

    <UiInput
      v-model="model"
      label="Data model"
      type="json"
    />

    <CmsPage
      v-model="model"
      :page="page"
    />
  </div>
</template>