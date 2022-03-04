<script setup>
import UiLoading from './UiLoading.vue'
</script>

<template>
  <div class="UiLoadingDocs">
    <UiLoading />

    <UiLoading text="No hay nada aqui" />

    <UiLoading>
      <div>
        <h1>NO HAY NADA AQUI</h1>
      </div>
    </UiLoading>
  </div>
</template>