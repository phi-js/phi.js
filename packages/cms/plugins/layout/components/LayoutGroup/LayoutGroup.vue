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
    :style="{display: 'flex', flexDirection: props.direction}"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.LayoutGroup > * {
  flex: 1;
}
</style>