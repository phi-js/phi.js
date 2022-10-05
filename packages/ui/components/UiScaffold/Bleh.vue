<script setup>
import { inject } from 'vue'
const injected = inject('_test_scaffold')
</script>

<template>
  <div
    v-bind="injected.dragEvents"
    @click="injected.focusThing($el, $slots.toolbar)"
    @mouseenter="injected.highlightThing($el)"
  >
    <slot />
  </div>
</template>