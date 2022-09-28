<script setup>
import { computed } from 'vue'
const props = defineProps({

  /*
  SIZE object
  If null, no borders or content delimiters are shown.  It basically does nothing

  {
    width: int | null,
    height: int | null,
    scale: int | null,
  }
  */
  size: {
    type: Object,
    required: false,
    default: null,
  },
})

const bodyStyle = computed(() => {
  const intWidth = parseInt(props.size?.width)
  const intHeight = parseInt(props.size?.height)
  // const scale = Math.min(Math.max(parseInt(props.size.scale), 25), 150)

  return {
    width: intWidth >= 0 ? `${intWidth}px` : '100%',
    minHeight: intHeight >= 0 ? `${intHeight}px` : '100%',
    height: '100%',
    // transform: `scale(${props.size.scale}%)`, // fucks up children with position:fixed
  }
})
</script>

<template>
  <div
    class="UiContentWrapper"
    :class="{'UiContentWrapper--no-border': !size?.width || !size?.height}"
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
  padding: 26px 28px;
  background-color: #525659;
  box-shadow: inset 0px 2px 12px 0px rgba(38, 57, 77, 0.7);

  &__body {
    transition: width var(--ui-duration-snap) ease, height var(--ui-duration-snap) ease;
    transform-origin: top center;
    margin: auto;

    background-color: var(--ui-color-background);
    color: var(--ui-color-foreground);
    box-shadow: rgb(38, 57, 77) 0px 20px 30px -22px;

    // https://stackoverflow.com/questions/19718634/how-to-disable-margin-collapsing
    padding: 0.05px; // prevent margin collapse (i.e. keep children with margins correctly contained inside __body)
  }
}

.UiContentWrapper--no-border {
  padding: 0;
  background-color: transparent;
  box-shadow: none;

  .UiContentWrapper__body {
    background-color: transparent;
    overflow: visible;
    box-shadow: none;
  }
}


@media only screen and (max-width: 768px) {
  .UiContentWrapper {
    padding: 0;
    background-color: transparent;

    &__body {
      overflow: visible;
      box-shadow: none;
    }
  }
}
</style>