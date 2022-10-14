<script setup>
import { computed, ref } from 'vue'

const hoveredElement = ref()
const elementBounds = ref()

const refScaffold = ref()
const containerBounds = computed(() => {
  if (!refScaffold.value?.offsetParent) {
    return null
  }

  console.log('computing containerBounds', refScaffold.value.offsetParent)
  return refScaffold.value.offsetParent.getBoundingClientRect()
})

function setHoveredElement(el) {
  hoveredElement.value = el
  elementBounds.value = el.getBoundingClientRect()
}

function clearHoveredElement() {
  hoveredElement.value = null
  elementBounds.value = null
}

function onBlockMouseenter(event) {
  setHoveredElement(event.target)
}

function onBlockMouseleave(event) {
  // ignore groups for not
  if (event.target.classList.contains('SomeBlock--group')) {
    // clearHoveredElement()
    return
  }
}

const scaffoldStyle = computed(() => {
  const offsetTop = (containerBounds.value?.top || 0) - window.scrollY
  const offsetLeft = (containerBounds.value?.left || 0) - window.scrollX

  return {
    'top': elementBounds.value?.top ? Math.floor(elementBounds.value.top - offsetTop) + 'px' : 'auto',
    'left': elementBounds.value?.left ? Math.floor(elementBounds.value.left - offsetLeft) + 'px' : 'auto',
    '--scaf-width': elementBounds.value?.width ? elementBounds.value.width + 'px' : 'auto',
    '--scaf-height': elementBounds.value?.height ? elementBounds.value.height + 'px' : 'auto',
  }
})
</script>

<template>
  <!-- eslint-disable max-len -->
  <div
    class="SomeBlock SomeBlock--group"
    @mouseenter="onBlockMouseenter"
    @mouseleave="onBlockMouseleave"
  >
    <div
      class="SomeBlock SomeBlock--image custom-class-1"
      @mouseenter="onBlockMouseenter"
      @mouseleave="onBlockMouseleave"
    >
      <img
        class="MediaImage__img"
        src="http://phi.local/build/images/dalle-shark.png"
        style="height: 100%; max-width: 100%;"
      >
    </div>
    <div
      class="SomeBlock SomeBlock--lorem"
      @mouseenter="onBlockMouseenter"
      @mouseleave="onBlockMouseleave"
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
    </div>
    <div
      class="SomeBlock SomeBlock--lorem"
      @mouseenter="onBlockMouseenter"
      @mouseleave="onBlockMouseleave"
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
    </div>

    <div
      class="SomeBlock SomeBlock--image custom-class-2"
      @mouseenter="onBlockMouseenter"
      @mouseleave="onBlockMouseleave"
    >
      <img
        class="MediaImage__img"
        src="http://phi.local/build/images/dalle-giraffe.png"
        style="height: 100%; max-width: 100%;"
      >
    </div>

    <div
      class="SomeBlock SomeBlock--lorem"
      @mouseenter="onBlockMouseenter"
      @mouseleave="onBlockMouseleave"
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
    </div>
  </div>

  <div
    v-if="hoveredElement"
    ref="refScaffold"
    class="TheScaffold"
    :style="scaffoldStyle"
  >
    <div class="TheScaffold__toolbar-container">
      <div class="TheScaffold__toolbar-stick">
        <div class="TheScaffold__toolbar">
          HELLO THERE
        </div>
      </div>
    </div>

    <div class="TheScaffold__body" />
  </div>
</template>

<style lang="scss">

// Nice!
.TheScaffold,
.TheScaffold__body {
  // transition: all 0.08s;
  transition: all 0.05s;
}

.TheScaffold {
  --ui-color-primary: #41b883;

  position: absolute;
  box-sizing: border-box;

  &__body {
    border: 2px solid var(--ui-color-primary);
    border-radius: 4px;

    position: absolute;
    z-index: -1;
    top: -4px;
    left: -4px;
    width: calc(var(--scaf-width, 100%) + 8px);
    height: calc(var(--scaf-height, 100%) + 8px);

    // pointer-events: none; // z-index: -1 is better
    background-color: #ffff8844;
  }

  &__toolbar-container {
    position: sticky;
    top: 48px;
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
  }

  &__toolbar-stick {
    position: absolute;
    bottom: 100%;
    left: 16px;
  }

  &__toolbar {
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    color: #ffffff80;
    background-color: #313131;
    border-radius: 5px;

    font-size: 0.9em;
    font-weight: bold;

    user-select: none;
    cursor: pointer;
    opacity: 0.9;
    &:hover {
      opacity: 1;
    }

    white-space: nowrap;
  }
}

.xSomeBlock {
  border: 1px dashed red;
  padding: 4px;
}

.SomeBlock--group {
  max-width: 600px;
  margin: auto;
  position: relative;
}

.SomeBlock--lorem {
  h1,h2,h3,h4,p {
    margin: 0;
  }

  p {
    text-align: justify;
    margin: 0.7em 0;
  }
}

.custom-class-1 {
  max-width: 200px;
  float: right;
  margin-left: 2em;

  & > img {
    border: 8px solid white;
    transform: rotateZ(2deg);
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
    border-radius: 5px;
  }
}

.custom-class-2 {
  width: 300px;
  height: 300px;

  float: left;
  margin-right: 2em;
  transform: rotateZ(-3deg);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}
</style>