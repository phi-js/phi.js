<script setup>
const props = defineProps({
  error: {
    required: false,
    default: null,
    validator: () => true
  }
})
</script>

<template>
  <div class="Error">
    <h1>Error</h1>
    <pre>props: {{ props }}</pre>
  </div>
</template>