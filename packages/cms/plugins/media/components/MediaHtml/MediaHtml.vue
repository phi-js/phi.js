<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: false,
    default: null,
  },
})

const htmlValue = computed(() => typeof props.value == 'string'
  ? props.value
  : '')
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="htmlValue"
    class="MediaHtml story-html"
    v-html="htmlValue"
  />
  <div
    v-else
    class="MediaHtml story-html"
    v-text="props.value"
  />
</template>

<style lang="scss">
.MediaHtml {
  word-break: break-word;
}
</style>