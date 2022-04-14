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
  <img :src="props.value">
</template>