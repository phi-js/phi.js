<script setup>
import UiFolder from './UiFolder.vue'
import { UiInput } from '../UiInput'
import { ref } from 'vue'
const items = [
  {
    type: 'suggestion',
    text: 'Enlaces planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'suggestion',
    text: 'Enlaces planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },

  { type: 'folder', text: 'Create folder', icon: 'mdi:plus' },
  { type: 'folder', text: 'Actas' },
  { type: 'folder', text: 'Backups' },
  { type: 'folder', text: 'Burocracia' },
  { type: 'folder', text: 'Casos' },
  { type: 'folder', text: 'Actas' },
  { type: 'folder', text: 'Backups' },
  { type: 'folder', text: 'Burocracia' },
  { type: 'folder', text: 'Casos' },

  { type: 'interface', text: 'Create interface', icon: 'mdi:plus' },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones I trimestre',
    subtext: 'La guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
  {
    type: 'interface',
    text: 'Planeaciones II trimestre',
    subtext: 'La otra guia de enlaces para tal cosa',
    icon: 'mdi:file-excel',
    preview: 'https://lh3.google.com/u/0/d/1Nm_G24Ro8TKZabHmpkLbQQrre5tGESlV=w300-k-nu-iv3',
  },
]

const sectionsA = [
  {
    text: 'Suggestions',
    match: { type: 'suggestion' },
  },
]

const sections = [
  {
    text: 'Folders',
    match: { type: 'folder' },
  },
  {
    text: 'Interfaces',
    match: { type: 'interface' },
  },
]

const currentView = ref('grid')
</script>

<template>
  <div class="UiFolder-docs">
    <h1>UiFolder</h1>
    <UiInput
      v-model="currentView"
      type="select-buttons"
      :options="['grid', 'table']"
    />

    <UiFolder
      :items="items"
      :sections="sectionsA"
    />
    <UiFolder
      :view="currentView"
      :items="items"
      :sections="sections"
    />
  </div>
</template>