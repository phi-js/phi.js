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
    :style="{
      display: props.direction == 'row' ? 'flex' : 'block',
      flexDirection: props.direction,
      flexWrap: 'nowap',
    }"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.LayoutGroup > * {
  flex: 1;
}
</style>