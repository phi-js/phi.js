<script setup>
import { ref, onMounted, watch } from 'vue'

// Lista de ecuaciones con link a .tex descargables
// https://dlmf.nist.gov/
import katex from 'katex'
import 'katex/dist/katex.min.css'

const rootEl = ref()

const props = defineProps({
  value: {
    type: String,
    required: false,
    default: null,
  },
})

onMounted(() => render(props.value))

watch(
  () => props.value,
  (newValue) => render(newValue),
  { immediate: false },
)

function render(newValue) {
  if (!rootEl.value) {
    return
  }

  if (!newValue) {
    rootEl.value.innerHTML = '?'
    return
  }
  katex.render(newValue, rootEl.value, {
    output: 'html',
    throwOnError: false,
  })
}
</script>

<template>
  <div
    ref="rootEl"
    class="UiKatex"
  />
</template>