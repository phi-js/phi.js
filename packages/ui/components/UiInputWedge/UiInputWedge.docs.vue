<script setup>
import { ref } from 'vue'
import { UiInputWedge } from '.'

const someValue = ref('Hello world')
</script>

<template>
  <UiInputWedge v-model="someValue" />
  <pre>someValue: {{ someValue }}</pre>
  <input
    v-model="someValue"
    type="text"
  >
</template>