<script setup>
defineProps({
  value: {
    type: String,
    required: false,
    default: null,
  },
})
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="MediaHtml story-html"
    v-html="value"
  />
</template>

<style lang="scss">
.MediaHtml {
  word-break: break-word;
}
</style>