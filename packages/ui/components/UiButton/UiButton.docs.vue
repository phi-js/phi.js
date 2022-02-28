<script setup>
import { ref } from 'vue'
import UiButton from './UiButton.vue'

const isLoading = ref(false)
function doLoad() {
  isLoading.value = true
  setTimeout(() => isLoading.value = false, 1000)
}
</script>

<template>
  <div class="UiButtonDocs">
    <UiButton text="Trigger load" @click="doLoad()" />

    <fieldset>
      <legend>Button nativo</legend>
      <button type="button">Este es un slot</button>

      <button type="button" class="UiButton">Boton .UiButton</button>
      <button type="button" class="UiButton UiButton--loading">.UiButton--loading</button>
      <button type="button" class="UiButton UiButton--error">.UiButton--error</button>
    </fieldset>

    <fieldset>
      <legend>UiButton</legend>
      <br />
      <UiButton :isLoading="isLoading" @click="doLoad()" icon="mdi:upload" />
      <!-- <br><UiButton :isLoading="isLoading" @click="doLoad()" value="Este es un valor" />
      <br><UiButton :isLoading="isLoading" @click="doLoad()" text="Este es un text" />
      <br><UiButton :isLoading="isLoading" @click="doLoad()">Este es un slot</UiButton>-->

      <br />
      <UiButton
        :isLoading="isLoading"
        @click="doLoad()"
        text="Cargar (err)"
        error="Código no encontrado"
      />
      <UiButton :isLoading="isLoading" @click="doLoad()" text="Cargar" loading-text="Cargando" />
      <br />
      <UiButton
        :isLoading="isLoading"
        @click="doLoad()"
        icon="mdi:upload"
        loading-text="Cargando"
        value="Este es un valor"
      />
      <br />
      <UiButton
        :isLoading="isLoading"
        @click="doLoad()"
        loading-text="Cargando"
        text="Wachu wachu"
        subtext="Hola mundo"
      />
      <br />
      <UiButton :isLoading="isLoading" @click="doLoad()" loading-text="Cargando">Este es un slot</UiButton>
    </fieldset>
  </div>
</template>