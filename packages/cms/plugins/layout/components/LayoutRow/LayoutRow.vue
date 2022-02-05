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
    <div class="ui__content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.LayoutRow {
  .ui__content {
    display: flex;
    flex-wrap: wrap;

    .LayoutColumn {
      flex: 1;
    }
  }
}
</style>