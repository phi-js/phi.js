<script setup>
import { ref } from 'vue'
import { UiIconPicker } from '.'
const icon = ref('mdi:account')
</script>

<template>
  <UiIconPicker v-model="icon" />
  <pre>icon: {{ icon }}</pre>
</template>
