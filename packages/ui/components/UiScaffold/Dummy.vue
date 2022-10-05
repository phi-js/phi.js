<script setup>
import { ref } from 'vue'
import Bleh from './Bleh.vue'
const msg = ref('')
</script>

<template>
  <Bleh class="SomeDummy">
    <template #toolbar>
      <input
        v-model="msg"
        type="text"
      >
    </template>
    <template #default>
      <h3>{{ msg || 'nothing' }}</h3>
    </template>
  </Bleh>
</template>