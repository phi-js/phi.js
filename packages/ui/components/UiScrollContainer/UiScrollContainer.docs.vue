<script setup>
import { ref } from "vue"
import UiScrollContainer from "./UiScrollContainer.vue";

const loader = ref(true);
const counter = ref(100);

const handleScroll = () => {
  if (counter.value >= 500) {
    loader.value = false;
    return;
  }
  setTimeout(() => counter.value += 100, 600);
}
</script>

<template>
  <div>
    <h1>Documentación "UiScrollContainer"</h1>
    <hr>
    <UiScrollContainer @scroll-bottom="handleScroll" style="height: 200px;">
      <ul>
        <li v-for="n in counter">Item {{ n }}</li>
      </ul>
      <div v-if="loader">..cargando...</div>
    </UiScrollContainer>
  </div>
</template>