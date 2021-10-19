<script setup>
import { ref } from 'vue'
import { UiKatex } from '.'

const math = ref('x = \\frac { -b \\pm \\sqrt{ b^2-4ac } } { 2a }')

</script>

<template>
  <textarea
    v-model="math"
    style="width: 500px; height: 140px"
  />
  <UiKatex :value="math" />
  <pre>math: {{ math }}</pre>
</template>