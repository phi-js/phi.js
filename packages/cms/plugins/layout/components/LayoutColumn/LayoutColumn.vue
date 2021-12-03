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