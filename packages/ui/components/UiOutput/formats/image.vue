<script setup>
const props = defineProps({
  value: {
    type: String, // image URL
    required: false,
    default: null,
  },
})
</script>

<template>
  <a
    target="_blank"
    :href="props.value"
  >
    <img
      :src="props.value"
      style="max-width: 80px"
    >
  </a>
</template>