<script setup>
import { ref } from 'vue'
import { UiWindow } from '.'
const isOpen = ref(false)
</script>

<template>
  <button @click="isOpen = !isOpen">
    Toggle window ({{ isOpen }})
  </button>

  <UiWindow v-model:open="isOpen">
    <h1>Soy una ventana</h1>
    <p>HOLA MUNDO</p>
  </UiWindow>
</template>