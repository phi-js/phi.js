<script setup>
import { ref } from 'vue'
import { CmsPage } from './index.js'
import { UiForm } from '/packages/ui/components'

import { CmsPageEditor } from '../CmsPageEditor'

const page = ref({
  blocks: [
    {
      component: 'MediaHtml',
      props: { value: '<h2>Hola {{ nombre }}!</h2><p>Contenido <strong>HTML</strong> aqui {{ foo.nombre }}</p>' },
    },
    {
      'component': 'InputText',
      'props': { placeholder: 'Nombre aqui' },
      'v-model': 'nombre',
    },
    {
      'component': 'MediaHtml',
      'props': { value: '<h2>Se excede el limite de {{ limit }}! (Hay {{ cantidad }})</h2>' },
      'v-if': {
        field: 'cantidad',
        op: 'gt',
        args: '{{ limit }}',
      },
    },
    {
      component: 'MediaLoremIpsum',
      props: {
        nParagraphs: '{{ cantidad }}',
        nWords: '{{ palabras }}',
      },

    },
    {
      'component': 'InputButton',
      'props': { label: 'Test' },
      'v-on': {
        click: {
          call: 'window.alert',
          args: 'CLICK!',
        },
      },
    },
  ],
})

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
</script>

<template>
  <div class="docs-page ui-row --top">
    <div style="max-width: 50%;">
      <CmsPageEditor v-model:page="page" />
      <hr>
      <UiForm
        v-model="model"
        :fields="[
          { type: 'text', label: 'Nombre', model: '$.nombre' },
          { type: 'number', label: 'Parrafos', model: '$.cantidad', min: 1 },
          { type: 'number', label: 'Palabras', model: '$.palabras', min: 55 },
          { type: 'number', label: 'Limit', model: '$.limit', min: 0 },
        ]"
      />
    </div>
    <CmsPage
      v-model="model"
      :page="page"
    />
  </div>
</template>