<script setup>
const props = defineProps({
  /* flex-direction: row | column */
  direction: {
    type: String,
    required: false,
    default: 'column',
    validator: (v) => ['row', 'column'].includes(v),
  },

  /* CSS property.  align-items: */
  alignItems: {
    type: String,
    required: false,
    default: null,
  },

  /* CSS property.  justify-content: */
  justifyContent: {
    type: String,
    required: false,
    default: null,
  },
  /* CSS property.  gap (in pixels) */
  gap: {
    type: [String, Number],
    required: false,
    default: null,
  },
})
</script>

<template>
  <div
    class="LayoutGroup"
    :style="{
      display: props.direction == 'row' ? 'flex' : 'block',
      flexDirection: props.direction,
      flexWrap: 'wrap',
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      gap: props.gap ? `${props.gap}px` : null
    }"
  >
    <slot />
  </div>
</template>