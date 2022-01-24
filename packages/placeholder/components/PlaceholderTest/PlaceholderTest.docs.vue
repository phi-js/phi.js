<script setup>
import { PlaceholderTest } from './index.js'

import { provideApi } from '@/packages/api'
provideApi('https://jsonplaceholder.typicode.com')

// import { Client, provideApi } from '@/packages/api'
// const api = new Client('https://jsonplaceholder.typicode.com')
// provideApi(api)
</script>

<template>
  <h1>PlaceholderTest</h1>
  <PlaceholderTest /> <!-- Use client provided via provideApi  -->
  <!-- <PlaceholderTest :api-client="api" /> -->  <!-- Use client provided via attrs -->
</template>
