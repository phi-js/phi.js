<script setup>
import { provide, ref, shallowRef } from 'vue'

import UiScaffold from './UiScaffold.vue'
import UiItem from '../UiItem/UiItem.vue'

import Dummy from './Dummy.vue'

const hoveredElement = ref()
const focusedElement = ref()

let deselectTimeout = null

let draggedElement = null
let dropQuadrant = null
let dropGhost = null

const isDragging = ref(false)

const blockEvents = {
  onMouseenter(event) {
    if (isDragging.value) {
      return
    }

    clearTimeout(deselectTimeout)
    hoveredElement.value = event.currentTarget
  },

  onMouseleave() {
    if (isDragging.value) {
      return
    }

    clearTimeout(deselectTimeout)
    deselectTimeout = setTimeout(() => hoveredElement.value = null, 50)
  },

  onClick(event) {
    if (isDragging.value) {
      return
    }

    event.stopPropagation()
    focusedElement.value = event.currentTarget
    scaffoldToolbar.value = null
    clearTimeout(deselectTimeout)
  },

  onDragover,
  // onDrop,
  // onDragenter,
  onDragleave,
}

function onScaffoldMouseenter() {
  clearTimeout(deselectTimeout)
}

function onScaffoldMouseleave() {
  blockEvents.onMouseleave()
}

function onDragStart(event, targetElement = null) {

  draggedElement = targetElement
  isDragging.value = true

  dropGhost = draggedElement.cloneNode(true)
  dropGhost.classList.add('DropGhost')

  event.dataTransfer.setDragImage(dropGhost, 0, 0)
  draggedElement.parentNode.insertBefore(dropGhost, draggedElement)

  draggedElement.style.display = 'none'
}

function onDragEnd() {
  isDragging.value = false
  dropGhost.parentNode.insertBefore(draggedElement, dropGhost)
  dropGhost.remove()

  draggedElement.style.display = null

  focusedElement.value = null
  setTimeout(() => {
    focusedElement.value = draggedElement
    draggedElement = null
  }, 0)
}

// function onDragenter(event) {
// }

function onDragleave() {
  dropQuadrant = null
}


function onDragover(event) {
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  /*
  Determine which quadrant the mouse is in (relative to the droptarget)
  |-----------|
  |  1  |  2  |
  |-----------|
  |  3  |  4  |
  |-----------|
  */
  let quadrant = null
  if (event.offsetY < event.currentTarget.offsetHeight / 2) {
    if (event.offsetX < event.currentTarget.offsetWidth / 2) {
      quadrant = 1
    } else {
      quadrant = 2
    }
  } else {
    if (event.offsetX < event.currentTarget.offsetWidth / 2) {
      quadrant = 3
    } else {
      quadrant = 4
    }
  }

  if (quadrant != dropQuadrant) {
    dropQuadrant = quadrant

    // const animationFrames = [
    //   { maxHeight: '0', overflow: 'hidden' },
    //   { maxHeight: '300px', overflow: 'hidden' },
    // ]
    // const animationSettings = {
    //   duration: 888,
    //   iterations: 1,
    // }

    // Does our drop target have a sibling NEXT to it (horizontally) ?
    const brother = event.currentTarget.previousElementSibling || event.currentTarget.nextElementSibling
    if (brother) {
      // see if they are side by side.
      const brotherBounds = brother.getBoundingClientRect()
      const mahBoungs = event.currentTarget.getBoundingClientRect()

      if (brotherBounds.top < mahBoungs.bottom && brotherBounds.bottom > mahBoungs.top) {
        if (dropQuadrant == 1 || dropQuadrant == 3) {
          event.currentTarget.parentNode.insertBefore(dropGhost, event.currentTarget)
        } else {
          event.currentTarget.parentNode.insertBefore(dropGhost, event.currentTarget.nextSibling)
        }

        // dropGhost.animate(animationFrames, animationSettings)
        return
      }
    }

    if (dropQuadrant == 1 || dropQuadrant == 2) {
      event.currentTarget.parentNode.insertBefore(dropGhost, event.currentTarget)
    } else {
      event.currentTarget.parentNode.insertBefore(dropGhost, event.currentTarget.nextSibling)
    }

    // dropGhost.animate(animationFrames, animationSettings)
  }
}

// function onDrop(event) {
// }
const scaffoldToolbar = shallowRef()

provide('_test_scaffold', {
  focusThing(domNode, toolbarSlot = null) {
    focusedElement.value = domNode
    scaffoldToolbar.value = toolbarSlot
  },

  highlightThing(domNode) {
    clearTimeout(deselectTimeout)
    hoveredElement.value = domNode
  },

  dragEvents: {
    onDragover,
    onDragleave,
  },
})
</script>

<template>
  <!-- eslint-disable max-len -->
  <div
    class="SomeBlock SomeBlock--group"
    :class="{'Container--dragging': isDragging}"
  >
    <div
      class="SomeBlock SomeBlock--lorem"
      v-bind="blockEvents"
    >
      <h1>Hello World</h1>
    </div>

    <Dummy class="SomeBlock SomeBlock--dummy" />

    <div
      class="SomeBlock SomeBlock--image custom-class-1"
      v-bind="blockEvents"
    >
      <img
        class="MediaImage__img"
        src="http://phi.local/build/images/dalle-shark.png"
        style="height: 100%; max-width: 100%;"
      >
    </div>

    <div
      class="SomeBlock SomeBlock--lorem"
      v-bind="blockEvents"
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
    </div>

    <Dummy class="SomeBlock SomeBlock--dummy" />

    <div
      class="SomeBlock SomeBlock--lorem"
      v-bind="blockEvents"
    >
      <p>AQUI Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
    </div>

    <Dummy class="SomeBlock SomeBlock--dummy" />

    <div
      class="SomeBlock SomeBlock--image custom-class-2"
      v-bind="blockEvents"
    >
      <img
        class="MediaImage__img"
        src="http://phi.local/build/images/dalle-giraffe.png"
        style="height: 100%; max-width: 100%;"
      >
    </div>

    <div
      class="SomeBlock SomeBlock--lorem"
      v-bind="blockEvents"
    >
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur habichuela porta. Nam dapibus magna ac lacus viverra, condimentum feugiat velit consectetur mater. Interdum et malesuada fames ac ante ipsum primis in faucibus anus. Etiam dignissim tempus nulla, in lacinia orci aliquam sed ar mola.</p>
    </div>

    <div
      class="SomeBlock--row"
    >
      <img
        v-bind="blockEvents"
        class="SomeBlock SomeBlock--img"
        src="http://phi.local/build/images/dalle-shark.png"
      >
      <img
        v-bind="blockEvents"
        class="SomeBlock SomeBlock--img"
        src="http://phi.local/build/images/dalle-giraffe.png"
      >
      <img
        v-bind="blockEvents"
        class="SomeBlock SomeBlock--img"
        src="http://phi.local/build/images/dalle-panda.png"
      >
      <img
        v-bind="blockEvents"
        class="SomeBlock SomeBlock--img"
        src="http://phi.local/build/images/dalle-shark.png"
      >
    </div>
  </div>

  <UiScaffold
    v-if="hoveredElement && hoveredElement != focusedElement"
    class="HoverScaff"
    :class="{'HoverScaff--dragging': isDragging}"
    :element="hoveredElement"
    @mouseenter="onScaffoldMouseenter"
    @mouseleave="onScaffoldMouseleave"
  >
    <!-- <div
      draggable="true"
      class="HoverScaff__toolbar"
      @dragstart="onDragStart($event, hoveredElement)"
      @dragend="onDragEnd"
      @click="focusedElement = hoveredElement"
    >
      Tiny block
    </div> -->
  </UiScaffold>

  <UiScaffold
    v-if="focusedElement"
    class="HoverScaff"
    :class="{'HoverScaff--dragging': isDragging}"
    :element="focusedElement"
  >
    <div class="HoverScaff__toolbar">
      <UiItem
        text="Block"
        icon="mdi:drag"
        draggable="true"
        @dragstart="onDragStart($event, focusedElement)"
        @dragend="onDragEnd"
        @click="focusedElement = null"
      />

      <Component
        :is="scaffoldToolbar"
        v-if="scaffoldToolbar"
      />
    </div>
  </UiScaffold>
</template>

<style lang="scss">
.Container--dragging {
  .SomeBlock * {
    pointer-events: none;
  }
}

.DropGhost {
  opacity: 0.6;
  pointer-events: none;
  outline: 1px solid var(--ui-color-primary);
}

.HoverScaff {
  // --scaffold-transition-duration: 90ms;
  --scaffold-transition-duration: 60ms;

  &--dragging {
    border: 3px solid red;
    opacity: 0;
  }

  &__toolbar {
    --ui-item-padding: 0 12px;
    padding-right: 12px;

    .UiItem__icon {
      cursor: move;
    }

    height: 40px;
    display: flex;
    align-items: center;
    color: #ffffff80;
    background-color: #313131;
    border-radius: 5px;

    font-size: 0.9em;
    font-weight: bold;

    user-select: none;
    cursor: pointer;
    // opacity: 0.9;
    // &:hover {
    //   opacity: 1;
    // }

    white-space: nowrap;
  }
}

.SomeBlock--row {
  display: flex;
  flex-wrap: wrap;
  & > * {
    flex: 1;
  }
}

.SomeBlock--img {
  max-width: 300px;
  max-height: 300px;
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