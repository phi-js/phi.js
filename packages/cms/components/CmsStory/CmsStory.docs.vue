<script setup>
import { ref } from 'vue'
import { CmsStory } from '.'

import sampleStory from './samples/foo.story.js'
const dataModel = ref({})

// const fallbackNode = (nodeId) => ({
//   id: 404,
//   page: {
//     blocks: [
//       {
//         component: 'MediaHtml',
//         props: { value: `<h1>Página ${nodeId} no encontrada</h1>` },
//       },
//       {
//         'component': 'InputButton',
//         'props': { label: 'Regresar' },
//         'v-on': { click: { call: 'CmsStory.goBack' } },
//       },
//     ],
//   },
// })
</script>

<template>
  <CmsStory
    v-model="dataModel"
    :story="sampleStory"
  />
</template>