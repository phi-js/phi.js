<script setup>
import { ref } from 'vue'
import { UiTabs, UiTab } from '../'

import { UiWindow } from '.'
const isOpen = ref(false)
const msg = ref('Hola mundo')
</script>

<template>
  <button @click="isOpen = !isOpen">
    Toggle window ({{ isOpen }}) - {{ msg }}
  </button>

  <UiWindow v-model:open="isOpen">
    <template #default>
      <UiTabs>
        <UiTab text="tab1">
          Contenido del tab 1
          <p>{{ msg }}</p>
          <input
            v-model="msg"
            type="text"
          >
        </UiTab>
        <UiTab text="tab2">
          Contenido del tab 2
        </UiTab>
      </UiTabs>
    </template>
    <template #footer="{ close }">
      <button @click="close()">
        Aceptar
      </button>
      <button @click="close()">
        Cancelar
      </button>
    </template>
  </UiWindow>
</template>