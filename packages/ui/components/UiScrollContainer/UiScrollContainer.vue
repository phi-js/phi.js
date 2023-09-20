<script setup>
const emit = defineEmits(['scroll-bottom'])

const handleScroll = (event) => {
  const scrollableDiv = event.target;
  if (scrollableDiv.scrollTop + scrollableDiv.clientHeight >= scrollableDiv.scrollHeight) {
    emit('scroll-bottom');
  }
}
</script>

<template>
  <div class="UiScrollContainer" @scroll="handleScroll($event)">
    <slot></slot>
  </div>
</template>

<style lang="scss">
.UiScrollContainer {
  overflow: auto;
}
</style>