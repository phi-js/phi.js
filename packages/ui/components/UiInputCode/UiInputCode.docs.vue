<script setup>
import UiInputCode from './UiInputCode.vue'
import { ref } from 'vue'
const code = ref('return "hola"')
</script>

<template>
  <UiInputCode v-model="code" />
  <UiInputCode v-model="code" lang="css" />
  <UiInputCode v-model="code" lang="json" />
  <pre>code: {{ code }}</pre>
</template>