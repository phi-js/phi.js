<script setup>
const props = defineProps({
  /* flex-direction: row | column */
  direction: {
    type: String,
    required: false,
    default: 'column',
    validator: (v) => ['row', 'column'].includes(v),
  },
})
</script>

<template>
  <div
    class="LayoutGroup"
    :style="{flexDirection: props.direction}"
  >
    <slot />
  </div>
</template>