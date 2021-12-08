<script setup>
const props = defineProps({
  alignItems: {
    type: String,
    required: false,
    default: undefined,
  },
})
</script>

<template>
  <div
    class="LayoutRow"
    :style="{alignItems: props.alignItems}"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.LayoutRow {
  display: flex;
  flex-wrap: wrap;

  .LayoutColumn {
    flex: 1;
  }
}
</style>