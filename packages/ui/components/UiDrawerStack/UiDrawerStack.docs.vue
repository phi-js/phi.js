<script setup>
import { ref } from 'vue'
import UiDrawerStack from './UiDrawerStack.vue'
import UiTab from '../UiTabs/UiTab.vue'

const curValue = ref("1")
</script>

<template>
  <UiDrawerStack v-model="curValue">
    <UiTab value="1" text="Contenido 1">
      <h1>Soy el contenido 1</h1>
    </UiTab>

    <UiTab value="2" text="Contenido 2" subtext="Con subtext">
      <h1>Soy el contenido 2</h1>
    </UiTab>

    <UiTab value="3" text="Contenido 3" icon="mdi:vuejs">
      <h1>Soy el contenido 3</h1>
    </UiTab>
  </UiDrawerStack>
  <pre>curValue: {{ curValue }}</pre>
  <input type="text" v-model="curValue" />
</template>