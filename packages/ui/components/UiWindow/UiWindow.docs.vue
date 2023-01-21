<script setup>
import { ref } from 'vue'
import { UiTabs, UiTab } from '../'
import { UiWindow } from '.'
import LoremIpsum from '@/packages/cms/plugins/media/components/MediaLoremIpsum/MediaLoremIpsum.vue'

const isOpen = ref(false)
const msg = ref('Hola mundo')
</script>

<template>
  <button @click="isOpen = !isOpen">
    Toggle window ({{ isOpen }}) - {{ msg }}
  </button>

  <UiWindow v-model:open="isOpen">
    <template #default>
      <UiTabs style="height: 100%">
        <UiTab text="tab1">
          Contenido del tab 1
          <p>{{ msg }}</p>
          <input
            v-model="msg"
            type="text"
            class="UiInput"
          >
        </UiTab>
        <UiTab text="tab2">
          Contenido del tab 2
        </UiTab>
        <UiTab text="tab3">
          <LoremIpsum />
        </UiTab>
      </UiTabs>
    </template>
    <template #footer="{ close }">
      <button
        class="UiButton"
        @click="close()"
      >
        Aceptar
      </button>
      <button
        class="UiButton UiButton--cancel"
        @click="close()"
      >
        Cancelar
      </button>
    </template>
  </UiWindow>
</template>