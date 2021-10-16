<script setup>
import { ref } from 'vue'
import { CmsPageEditor } from '.'
import { CmsPage } from '../CmsPage'
import { UiInput } from '/packages/ui/components'

import * as samplePages from '../../samples'

const page = ref({ blocks: [] })

const availablePages = ref(Object.keys(samplePages).map((pageName) => ({
  text: `Page ${pageName}`,
  value: pageName,
})))

function pickPage(pageName) {
  page.value = samplePages[pageName]
}

const editorSettings = ref({ uploads: { endpoint: 'http://v4.local/1/cms/pages/test/files' } })

const model = ref({
  limit: 2,
  nombre: 'Santiago',
  cantidad: 1,
  palabras: 120,
  foo: {
    nombre: 'n',
    apellido: 'a',
  },
})

const modelSchema = ref({
  type: 'object',
  properties: {
    limit: { type: 'string', default: 2 },
    nombre: { type: 'string', default: 'Santiago' },
    cantidad: { text: 'No. de parrafos', type: 'string', default: 1 },
    palabras: { type: 'string', default: 120 },
    foo: {
      type: 'object',
      properties: {
        nombre: { type: 'string', default: 'n' },
        apellido: { type: 'string', default: 'a' },
      },
    },
  },
})
</script>

<template>
  <div class="docs-page">
    <UiInput
      type="select-native"
      label="Página"
      :options="availablePages"
      placeholder="Seleccionar pagina"
      @update:modelValue="pickPage($event)"
    />

    <CmsPageEditor
      v-model:page="page"
      :settings="editorSettings"
      :model-schema="modelSchema"
    />
    <hr>
    <CmsPage
      v-model="model"
      :page="page"
    />
  </div>
</template>