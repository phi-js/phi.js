<script setup>
import { onMounted } from 'vue'
const emit = defineEmits(['mounted'])
onMounted(() => emit('mounted'))
</script>

<template>
  <div class="LayoutPage">
    <slot />
  </div>
</template>