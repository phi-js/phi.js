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

  --ui-color-darken: rgba(0,0,0, 0.05);
  --ui-color-lighten: rgba(255,255,255, 0.15);

  // background-image:
  //   /* Darkener color on top */
  //   linear-gradient(
  //     var(--ui-color-darken),
  //     var(--ui-color-darken)
  //   ),
  //   /* Lightener color underneath */
  //   linear-gradient(
  //     var(--ui-color-lighten),
  //     var(--ui-color-lighten)
  //   );

  &__body {
    // transition: all var(--ui-duration-snap) ease;
    transition: width var(--ui-duration-snap) ease, height var(--ui-duration-snap) ease;

    transform-origin: top center;

    overflow-y: auto;
    overflow-x: visible;
    margin: auto;
    // box-shadow: rgb(38, 57, 77) 0px 20px 30px -22px;

    // background-color: var(--ui-color-z-0);
    // background-color: #fff;
    // color: initial;
  }

  &--desktop {
    padding: 0;
    margin-top: 32px;

    .UiContentWrapper__body {
      overflow: visible;
    }
  }

}
</style>