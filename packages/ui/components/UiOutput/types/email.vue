<script setup>
defineProps({
  value: {
    type: String,
    required: false,
    default: '',
  },

  text: {
    type: String,
    required: false,
    default: null,
  },
})
</script>

<template>
  <a
    :href="`mailto:${value}`"
    target="_blank"
    v-text="text || value"
  />
</template>