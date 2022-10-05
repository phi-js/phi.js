<script setup>
import { onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  /*
  HTML element to draw the scaffold around
  */
  element: {
    type: Object,
    required: true,
  },
})

const root = ref()
const scaffoldCoords = ref()
let resizeObserver

watch(
  () => props.element,
  () => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    resizeObserver = new ResizeObserver(onElementResized)
    resizeObserver.observe(props.element)
  },
  { immediate: true },
)

function onElementResized() {
  const elementBounds = props.element.getBoundingClientRect()
  const containerBounds = root.value
    ? root.value.offsetParent.getBoundingClientRect()
    : {}

  scaffoldCoords.value = {
    '--scaffold-top': Math.floor(elementBounds.top - containerBounds.top) + 'px',
    '--scaffold-left': Math.floor(elementBounds.left - containerBounds.left) + 'px',
    '--scaffold-width': elementBounds.width + 'px',
    '--scaffold-height': elementBounds.height + 'px',
  }
}

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

defineExpose({ root })
</script>

<template>
  <div
    ref="root"
    class="UiScaffold"
    :style="scaffoldCoords"
  >
    <div class="UiScaffold__toolbar-container">
      <div class="UiScaffold__toolbar-body">
        <slot />
      </div>
    </div>

    <div class="UiScaffold__body" />
  </div>
</template>

<style lang="scss">
// yay
.UiScaffold,
.UiScaffold__body {
  transition: all var(--scaffold-transition-duration);
}

.UiScaffold {
  --scaffold-border-offset: 4px;

  position: absolute;
  box-sizing: border-box;
  z-index: 0;

  top: var(--scaffold-top);
  left: var(--scaffold-left);
  height: var(--scaffold-height);
  width: 0;

  &__body {
    border: 1px solid var(--ui-color-primary);
    border-radius: 3px;

    position: absolute;
    z-index: -1;
    top: calc(var(--scaffold-border-offset) * -1);
    left: calc(var(--scaffold-border-offset) * -1);
    width: calc(var(--scaffold-width, 100%) + calc(var(--scaffold-border-offset) * 2));
    height: calc(var(--scaffold-height, 100%) + calc(var(--scaffold-border-offset) * 2));

    pointer-events: none;
    // background-color: #ffff8844;
  }

  &__toolbar-container {
    position: sticky;
    top: 56px; // must match toolbar height
    left: 0;
    z-index: 1;
  }

  &__toolbar-body {
    position: absolute;
    // bottom: calc(100% + var(--scaffold-border-offset));
    bottom: 100%;
    left: 0;
  }
}
</style>