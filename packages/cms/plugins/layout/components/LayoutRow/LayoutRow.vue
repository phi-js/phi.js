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
  >
    <div
      class="ui__content"
      :style="{alignItems: props.alignItems}"
    >
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
      max-width: 100%;
    }
  }
}
</style>