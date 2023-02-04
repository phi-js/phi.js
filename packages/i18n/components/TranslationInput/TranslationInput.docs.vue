<script setup>
import { ref } from 'vue'
import TranslationInput from './TranslationInput.vue'

const str = ref('Hello World!')

</script>

<template>
  <div class="TranslationInput-docs">
    <h1>TranslationInput</h1>
    <TranslationInput
      v-model="str"
      class="UiInput__element"
    />
    <pre>str: {{ str }}</pre>
  </div>
</template>