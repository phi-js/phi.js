<script setup>
const props = defineProps({
  flex: {
    type: [String, Number],
    required: false,
    default: undefined,
  },
})

</script>

<template>
  <div
    class="LayoutColumn"
    :style="{flex: props.flex}"
  >
    <slot />
  </div>
</template>

<style lang="scss">
.LayoutColumn {
  // prevent margin collapse within children
  // also, guarantee that LayoutColumn will be EXACTLY spaced when comparend with LayoutRowEditor
  & > * {
    border: 1px solid transparent;
  }
}
</style>