<script setup>
// Vue 3 <script setup> SFCs
// https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { ref } from 'vue';

defineProps({
  msg: String,
});

const count = ref(0);
</script>

<template>
  <h1>{{ msg }}</h1>
  <p>(Basado en el starter template de Vite)</p>

  <button
    type="button"
    @click="count++"
  >count is: {{ count }}</button>
</template>

<style scoped>
button {
  color: #247dba;
}
</style>