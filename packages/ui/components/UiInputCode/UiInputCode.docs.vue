<script setup>
import UiInputCode from './UiInputCode.vue'
import { ref } from 'vue'
const code = ref('return "hola"')
</script>

<template>
  <UiInputCode v-model="code" />
  <pre>code: {{ code }}</pre>
</template>