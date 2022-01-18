<script setup>
import { ref, watch, onMounted } from 'vue'

import { UiIcon } from '../UiIcon'
import { UiPopover } from '../UiPopover'
import { UiResizable } from '../UiResizable'
// import openWindow from './openWindow.js'

const props = defineProps({
  dock: {
    type: String,
    required: false,
    default: null,
    validator: (value) => [
      'top',
      'right',
      'bottom',
      'left',
      'popup',
      null,
    ].includes(value),
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },

  /** Nombre para guardar las coordenadas de la ventana en localStorage.  (null = no recordar) */
  name: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'update:dock'])

const coords = ref({
  top: '64px',
  left: '256px',
  width: '1024px',
  height: '768px',
})

onMounted(() => {
  if (props.name) {
    const storedCoords = JSON.parse(localStorage.getItem(`UiWindow-${props.name}`))
    if (storedCoords) {
      coords.value = storedCoords
      dock.value = storedCoords.dock
    }
  }
})

function storeCoords() {
  if (!props.name) {
    return
  }

  const targetValue = {
    ...coords.value,
    dock: dock.value,
  }

  localStorage.setItem(`UiWindow-${props.name}`, JSON.stringify(targetValue))
}


const isOpen = ref(false)
watch(
  () => props.open,
  (newValue) => {
    isOpen.value = newValue
    if (isOpen.value) {
      resizeBody(coords.value)
    }
  },
  { immediate: true },
)

const dock = ref(false)
watch(
  () => props.dock,
  (newValue) => dock.value = newValue,
  { immediate: true },
)

// const popupContents = ref()
const isMoving = ref(false)
const dropTarget = ref(null)

function close() {
  isOpen.value = false
  emit('update:open', isOpen.value)
  resizeBody()
}

function resizeBody(coords = null) {
  if (coords === null || (dock.value !== 'left' && dock.value !== 'right')) {
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = 'initial'
    return
  }

  // const offsetLeft = 240 // test
  const offsetLeft = 0

  switch (dock.value) {
  case 'left':
    document.body.style.marginLeft = Math.max(parseInt(coords.width) - offsetLeft, 0) + 'px'
    break
  case 'right':
    document.body.style.marginRight = Math.max(parseInt(coords.width), 0) + 'px'
    break
  }
}

function dockTo(newPosition) {
  if (dock.value === newPosition) {
    return
  }

  dock.value = newPosition
  emit('update:dock', dock.value)

  // if (dock.value == 'popup') {
  //   openWindow(popupContents.value, () => close())
  // }

  if (newPosition === null) {
    coords.value.top = '25vh'
    coords.value.left = '25vw'
    coords.value.width = '50vw'
    coords.value.height = '50vh'
  }

  resizeBody(coords.value)
  storeCoords()
}

const isHovered = ref(false)
</script>

<template>
  <div
    v-show="isOpen"
    :class="[
      'ui-theme-dark',
      'UiWindow UiWindow__scrim',
      {
        'UiWindow--moving': isMoving,
        'UiWindow--open': isOpen,
        'UiWindow--closed': !isOpen,
        'UiWindow--docked': !!dock,
        'UiWindow--external': dock == 'popup',
        'UiWindow--seethru': isOpen && !isHovered
      },
      `UiWindow--docked-${dock}`
    ]"
  >
    <div
      class="UiWindow__dockzone UiWindow__dockzone--top"
      @mouseenter="dropTarget = 'top'"
      @mouseleave="dropTarget = null"
    />
    <div
      class="UiWindow__dockzone UiWindow__dockzone--bottom"
      @mouseenter="dropTarget = 'bottom'"
      @mouseleave="dropTarget = null"
    />
    <div
      class="UiWindow__dockzone UiWindow__dockzone--left"
      @mouseenter="dropTarget = 'left'"
      @mouseleave="dropTarget = null"
    />
    <div
      class="UiWindow__dockzone UiWindow__dockzone--right"
      @mouseenter="dropTarget = 'right'"
      @mouseleave="dropTarget = null"
    />

    <UiResizable
      v-slot="{ startMove }"
      v-model:coords="coords"
      v-model:isMoving="isMoving"
      class="UiWindow__box ui__box ui--z"
      @update:coords="storeCoords"
      @move-end="dockTo(dropTarget)"

      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      @step="resizeBody"
    >
      <div class="UiWindow__header">
        <slot name="header" />

        <div
          style="flex:1; align-self: stretch; cursor: move;"
          @mousedown="startMove"
          @touchstart="startMove"
        />

        <UiPopover>
          <template #trigger>
            <UiIcon
              :src="dock
                ? (dock == 'popup' ? 'mdi:window-restore' : `mdi:dock-${dock}`)
                : 'mdi:card-outline'"
              class="ui--clickable"
              :class="{'--active': !dock}"
            />
          </template>
          <template #contents="popover">
            <div @click="popover.close()">
              <UiIcon
                src="mdi:card-outline"
                class="ui--clickable"
                :class="{'--active': !dock}"
                @click="dockTo(null)"
              />

              <UiIcon
                src="mdi:dock-bottom"
                class="ui--clickable"
                :class="{'--active': dock == 'bottom'}"
                @click="dockTo('bottom')"
              />

              <UiIcon
                src="mdi:dock-top"
                class="ui--clickable"
                :class="{'--active': dock == 'top'}"
                @click="dockTo('top')"
              />

              <UiIcon
                src="mdi:dock-left"
                class="ui--clickable"
                :class="{'--active': dock == 'left'}"
                @click="dockTo('left')"
              />

              <UiIcon
                src="mdi:dock-right"
                class="ui--clickable"
                :class="{'--active': dock == 'right'}"
                @click="dockTo('right')"
              />

              <!-- <UiIcon
                src="mdi:window-restore"
                class="ui--clickable"
                :class="{'--active': dock == 'popup'}"
                @click="dockTo('popup')"
              /> -->
            </div>
          </template>
        </UiPopover>

        <UiIcon
          src="mdi:close"
          class="ui--clickable window-close"
          @click="close"
        />
      </div>

      <div class="UiWindow__body">
        <slot
          name="default"
          :close="close"
        />
      </div>
      <footer class="UiWindow__footer ui-footer">
        <slot
          name="footer"
          :close="close"
        />
      </footer>
    </UiResizable>
  </div>
</template>

<style lang="scss">
/* Activar pointer-events (i.e. hovers de los dockzones) solo cuando la ventana se esta MOVIENDO */
.UiWindow {
  &__scrim {
    pointer-events: none;
  }

  &__box {
    pointer-events: initial;
  }

  &--moving.UiWindow__scrim {
    pointer-events: initial !important;
  }
}

/* Dock positions and decorations */
.UiWindow {
  &--docked &__box {
    border-radius: 0;
  }

  &--docked-top &__box {
    width: auto !important;
    top: 0 !important;
    right: 0 !important;
    bottom: initial;
    left: 0 !important;
  }

  &--docked-bottom &__box {
    width: auto !important;
    top: auto !important;
    right: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
  }

  &--docked-left &__box {
    height: auto !important;
    top: 0 !important;
    right: initial;
    bottom: 0 !important;
    left: 0 !important;
  }

  &--docked-right &__box {
    height: auto !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    left: auto !important;
  }
}

.UiWindow {
  --ui-window-dockzone-size: 64px;
  text-align: left;

  &--external {
    // display: none;
    // pointer-events: none;
    opacity: 0.4;
  }

  &__scrim {
    background-color: rgba(0, 0, 0, 0.02); // SCRIM
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
  }

  &__box {
    position: absolute;
    display: flex;
    flex-direction: column;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  &__header {
    display: flex;
    align-items: center;

    .ui--clickable {
      min-width: 32px;
      min-height: 32px;
    }
  }

  &__body {
    flex: 1;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255, 255, 255, 0.4);
      border-radius: 6px;
      border: 2px solid #333;
    }
  }

  &__dockzone {
    position: absolute;
    z-index: 3;

    transition: all var(--ui-duration-snap);
    background-color: var(--ui-color-primary);
    opacity: 0;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

    &:hover {
      opacity: 0.33;
    }

    &--top {
      top: 0;
      left: 0;
      right: 0;
      height: var(--ui-window-dockzone-size);
    }

    &--bottom {
      bottom: 0;
      left: 0;
      right: 0;
      height: var(--ui-window-dockzone-size);
    }

    &--right {
      right: 0;
      top: 0;
      bottom: 0;
      width: var(--ui-window-dockzone-size);
    }

    &--left {
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--ui-window-dockzone-size);
    }
  }
}

/// !!! Tabs inside Window
.UiWindow {
  .UiTabs {
    display: flex;
    flex-direction: column;

    &__contents {
      flex: 1;
      overflow: auto;
    }
  }
}
</style>