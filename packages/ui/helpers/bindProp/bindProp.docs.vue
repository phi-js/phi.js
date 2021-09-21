<script setup>
import { ref } from 'vue'
import ModelChanger from './ModelChanger.vue'
const myObject = ref()
</script>
<template>
  <h1>bindProp</h1>
  <ModelChanger v-model="myObject" />
  <pre>myObject: {{ myObject }}</pre>
</template>
