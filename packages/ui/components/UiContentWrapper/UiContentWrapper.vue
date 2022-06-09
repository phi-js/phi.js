<script setup>
import { computed } from 'vue'
const props = defineProps({

  // Width: int (pixels)
  width: {
    type: [Number, String],
    required: false,
    default: null,
  },

  // Height: int (pixels)
  height: {
    type: [Number, String],
    required: false,
    default: null,
  },

  // Scale: int 0-100
  scale: {
    type: [Number, String],
    required: false,
    default: 100,
  },
})

const bodyStyle = computed(() => {
  // const scale = Math.min(Math.max(parseInt(props.scale), 25), 150)
  return {
    // transform: `scale(${scale}%)`, // fucks up children with position:fixed
    width: props.width ? `${props.width}px` : '100%',
    height: props.height ? `${props.height}px` : '100%',
    maxHeight: '100%',
    // height: '100%',
  }
})
</script>

<template>
  <div
    class="UiContentWrapper"
    :class="{'UiContentWrapper--desktop': !props.width || !props.height}"
  >
    <div
      class="UiContentWrapper__body"
      :style="bodyStyle"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
.UiContentWrapper {
  position: relative;
  padding: 36px 42px;
  background-color: #525659;

  &__body {
    transition: width var(--ui-duration-snap) ease, height var(--ui-duration-snap) ease;
    transform-origin: top center;
    margin: auto;

    background-color: var(--ui-color-background);
    color: var(--ui-color-foreground);

    box-shadow: rgb(38, 57, 77) 0px 20px 30px -22px;
  }
}

.UiContentWrapper--no-border.UiContentWrapper--desktop {
  padding: 0;
  background-color: transparent;

  .UiContentWrapper__body {
    overflow: visible;
    box-shadow: none;
  }
}
</style>