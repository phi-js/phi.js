<script setup>
import { ref } from 'vue'
import VmConsole from './VmConsole.vue'

const stmt = ref({ and: [1, 2, 3, 4] })

</script>

<template>
  <VmConsole :value="stmt" />
</template>