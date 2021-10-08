<script setup>
import { ref } from 'vue'
import { UiInputJson } from '.'
const myObject = ref()
</script>
<template>
  <h1>UiInputJson</h1>
  <UiInputJson v-model="myObject" />
  <pre>myObject: {{ myObject }}</pre>
</template>
