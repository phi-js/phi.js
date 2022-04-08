<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { useAttrs, ref, watch, onMounted } from 'vue'

import { UiIcon } from '../UiIcon'
import { UiPopover } from '../UiPopover'
import { UiResizable } from '../UiResizable'
// import openWindow from './openWindow.js'

const attrs = useAttrs()

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


  /*
  Arreglo reactivo de coordenadas (valores css)
  {
    "top": "0px",
    "left": "0px",
    "width": "0px",
    "height": "0px"
  }
  */
  coords: {
    type: Object,
    required: false,
    default: null,
  },

  /** Nombre para guardar las coordenadas de la ventana en localStorage.  (null = no recordar) */
  name: {
    type: String,
    required: false,
    default: null,
  },

  /* <Teleport> target */
  container: {
    type: String,
    required: false,
    default: 'body',
  },
})

const emit = defineEmits(['update:open', 'update:dock', 'update:coords'])


/*
Arreglo interno CANONICO de las coords de la ventana
*/
const coords = ref({
  top: '64px',
  left: '256px',
  width: '1024px',
  height: '768px',
})
watch(
  () => props.coords,
  (newValue) => {
    if (!newValue) {
      return
    }
    coords.value = newValue
  },
  { immediate: true },
)


/*
Valor interno CANONICO del dock actual
*/
const dock = ref(false)
watch(
  () => props.dock,
  (newValue) => dock.value = newValue,
  { immediate: true },
)


const isOpen = ref(false)
watch(
  () => props.open,
  (newValue) => {
    isOpen.value = newValue
    if (isOpen.value) {
      repositionBody()
    }
  },
  { immediate: true },
)


const isMoving = ref(false)
const targetDock = ref(null)

function close() {
  isOpen.value = false
  emit('update:open', isOpen.value)
  resetBody()
}

/* Every dock holds a memory of its last used coords */
const dockCoords = ref({
  default: { top: '64px', left: '256px', width: '1024px', height: '768px' },

  top: { left: 0, right: 0, top: 0, height: '33vh' },
  bottom: { left: 0, right: 0, bottom: 0, height: '33vh' },
  left: { top: 0, bottom: 0, left: 0, width: '33vw' },
  right: { top: 0, bottom: 0, right: 0, width: '33vw' },
})


/* locally stored window position */
onMounted(() => {
  if (props.name) {
    const storedValue = JSON.parse(localStorage.getItem(`ui-window:${props.name}`))
    if (storedValue) {
      coords.value = storedValue?.coords
      dock.value = storedValue?.dock
      dockCoords.value = storedValue?.dockCoords
    }
  }

  if (props.open) {
    repositionBody()
  }
})

function persistData() {
  if (!props.name) {
    return
  }

  localStorage.setItem(`ui-window:${props.name}`, JSON.stringify({
    coords: coords.value,
    dock: dock.value,
    dockCoords: dockCoords.value,
  }))
}

function dockTo(newDockPosition) {
  if (dock.value === newDockPosition) {
    return
  }

  dock.value = newDockPosition

  const dockName = newDockPosition || 'default'
  coords.value = dockCoords.value[dockName]
  repositionBody()

  emit('update:dock', dock.value)
  persistData()
}

function onResizableMoveEnd() {
  dockTo(targetDock.value)
}

function onResizableEnd() {
  const dockName = dock.value || 'default'
  dockCoords.value[dockName] = coords.value
  persistData()
}

function onResizableUpdateCoords() {
  if (dock.value) { // reposition body while dragging docked window
    repositionBody()
  }
  emit('update:coords', coords.value)
}


function repositionBody() {
  switch (dock.value) {
  case 'top':
    document.body.style.marginTop = Math.max(parseInt(coords.value.height), 0) + 'px'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = 'initial'
    break
  case 'bottom':
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = Math.max(parseInt(coords.value.height), 0) + 'px'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = 'initial'

    break
  case 'left':
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = Math.max(parseInt(coords.value.width), 0) + 'px'
    document.body.style.marginRight = 'initial'
    break
  case 'right':
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = Math.max(parseInt(coords.value.width), 0) + 'px'
    break
  default:
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = 'initial'
    break
  }
}

function resetBody() {
  document.body.style.marginTop = 'initial'
  document.body.style.marginBottom = 'initial'
  document.body.style.marginLeft = 'initial'
  document.body.style.marginRight = 'initial'
}


const isHovered = ref(false)
</script>

<template>
  <Teleport :to="props.container">
    <div
      v-show="isOpen"
      v-bind="attrs"
      :class="[
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
        @mouseenter="targetDock = 'top'"
        @mouseleave="targetDock = null"
      />
      <div
        class="UiWindow__dockzone UiWindow__dockzone--bottom"
        @mouseenter="targetDock = 'bottom'"
        @mouseleave="targetDock = null"
      />
      <div
        class="UiWindow__dockzone UiWindow__dockzone--left"
        @mouseenter="targetDock = 'left'"
        @mouseleave="targetDock = null"
      />
      <div
        class="UiWindow__dockzone UiWindow__dockzone--right"
        @mouseenter="targetDock = 'right'"
        @mouseleave="targetDock = null"
      />

      <UiResizable
        v-slot="{ startMove }"
        v-model:coords="coords"
        v-model:isMoving="isMoving"
        class="UiWindow__box"
        @update:coords="onResizableUpdateCoords"
        @move-end="onResizableMoveEnd"
        @end="onResizableEnd"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
      >
        <div class="UiWindow__header">
          <div
            class="UiWindow__dragger"
            @mousedown="startMove"
            @touchstart="startMove"
          >
            <slot name="header" />
          </div>

          <UiPopover>
            <template #trigger>
              <UiIcon
                :src="dock
                  ? (dock == 'popup' ? 'mdi:window-restore' : `mdi:dock-${dock}`)
                  : 'mdi:card-outline'"
                class="ui--clickable"
                :class="{ '--active': !dock }"
              />
            </template>
            <template #contents="popover">
              <div
                class="UiWindow__dockPicker"
                @click="popover.close()"
              >
                <UiIcon
                  src="mdi:card-outline"
                  class="ui--clickable"
                  :class="{ '--active': !dock }"
                  @click="dockTo(null)"
                />

                <UiIcon
                  src="mdi:dock-bottom"
                  class="ui--clickable"
                  :class="{ '--active': dock == 'bottom' }"
                  @click="dockTo('bottom')"
                />

                <UiIcon
                  src="mdi:dock-top"
                  class="ui--clickable"
                  :class="{ '--active': dock == 'top' }"
                  @click="dockTo('top')"
                />

                <UiIcon
                  src="mdi:dock-left"
                  class="ui--clickable"
                  :class="{ '--active': dock == 'left' }"
                  @click="dockTo('left')"
                />

                <UiIcon
                  src="mdi:dock-right"
                  class="ui--clickable"
                  :class="{ '--active': dock == 'right' }"
                  @click="dockTo('right')"
                />

                <!-- <UiIcon
                src="mdi:window-restore"
                class="ui--clickable"
                :class="{'--active': dock == 'popup'}"
                @click="dockTo('popup')"
                />-->
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
            :coords="coords"
          />
        </div>
        <footer class="UiWindow__footer">
          <slot
            name="footer"
            :close="close"
            :coords="coords"
          />
        </footer>
      </UiResizable>
    </div>
  </Teleport>
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

/* Hide dragger and resizers when docked */
.UiWindow {
  &--docked &__box {
    .UiWindow__dragger {
      pointer-events: none;
    }

    .UiResizable__hotzone {
      display: none;
    }
  }

  &--docked-top &__box {
    .UiResizable__hotzone.--s {
      display: block;
    }
  }

  &--docked-bottom &__box {
    .UiResizable__hotzone.--n {
      display: block;
    }
  }

  &--docked-left &__box {
    .UiResizable__hotzone.--e {
      display: block;
    }
  }

  &--docked-right &__box {
    .UiResizable__hotzone.--w {
      display: block;
    }
  }
}

/* CSS enforced dock positions */
.UiWindow {
  &--docked-top &__box {
    top: 0 !important;
    bottom: auto !important;
    left: 0 !important;
    right: 0 !important;
    width: auto !important;
  }

  &--docked-bottom &__box {
    top: auto !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: auto !important;
  }

  &--docked-left &__box {
    top: 0 !important;
    bottom: 0 !important;
    left: 0 !important;
    right: auto !important;
    height: auto !important;
  }

  &--docked-right &__box {
    top: 0 !important;
    bottom: 0 !important;
    right: 0 !important;
    left: auto !important;
    height: auto !important;
  }
}

.UiWindow {
  --ui-window-dockzone-size: 7vh;
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
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  }

  &__header {
    display: flex;
    align-items: center;

    .ui--clickable {
      min-width: 32px;
      min-height: 32px;
    }
  }

  &__dragger {
    flex: 1;
    align-self: stretch;
    cursor: move;
  }

  &__body {
    flex: 1;
    overflow: auto; // popovers inside the window will be cropped, unless moved to the <body>

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
    box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px,
      rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;

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
</style>