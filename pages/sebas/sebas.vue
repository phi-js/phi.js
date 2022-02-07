<script setup>
import { ref } from "vue"
import { LocationPicker } from "/packages/phidias/components"

// import api
import { provideApi } from '@/packages/api'
provideApi('https://sebastian.api.phidias.co')

const location = ref({
  country: 'CO',
  province: null,
  city: null,
  postal: 1,
  lang: 'es',
  text: null
})
</script>

<template>
  <div id="stateSebas">
    <h1>Estado de pruebas</h1>

    <p>Objeto inicial</p>
    <pre>{{ location }}</pre>

    <LocationPicker v-model="location" />
  </div>
</template>