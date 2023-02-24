<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { useAttrs, ref, watch, onMounted, computed } from 'vue'

import { UiIcon } from '../UiIcon'
import { UiPopover } from '../UiPopover'
import { UiResizable } from '../UiResizable'
// import openWindow from './openWindow.js'

const attrs = useAttrs()

const props = defineProps({
  /** Nombre para guardar las coordenadas de la ventana en localStorage.  (null = no recordar) */
  name: {
    type: String,
    required: false,
    default: null,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },

  /*
  Arreglo de coordenadas iniciales
  (valores enteros, medidos en pixeles)
  {
    "top": 10,
    "left": 10,
    "width": 500,
    "height": 500
  }
  */
  coords: {
    type: Object,
    required: false,
    default: null,
  },

  dock: {
    type: String,
    required: false,
    default: null,
    validator: (value) => [
      'top',
      'right',
      'bottom',
      'left',
      null,
    ].includes(value),
  },


  /* <Teleport> target */
  container: {
    type: String,
    required: false,
    default: 'body',
  },
})

const emit = defineEmits(['update:open', 'update:dock', 'update:coords', 'cancel'])


/* Stored coords (for each dock) */
const storedCoords = ref({
  default: { top: 100, left: 100, width: 500, height: 550 },
  top: { height: 300 },
  bottom: { height: 300 },
  left: { width: 400 },
  right: { width: 400 },
})


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

function cancel() {
  emit('cancel')
  close()
}


/* locally stored window position */
onMounted(() => {
  if (props.name) {
    const storedValue = JSON.parse(localStorage.getItem(`ui-window:${props.name}`))
    if (storedValue) {
      dock.value = storedValue?.dock
      storedCoords.value = storedValue?.storedCoords
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
    dock: dock.value,
    storedCoords: storedCoords.value,
  }))
}

function dockTo(newDockPosition) {
  if (dock.value === newDockPosition) {
    return
  }

  dock.value = newDockPosition
  emit('update:dock', dock.value)

  repositionBody()
  persistData()
}

function onResizableMoveEnd() {
  dockTo(targetDock.value)
}

function onResizableEnd(coords) {
  storedCoords.value[dock.value || 'default'] = coords
  persistData()
}

function onResizableUpdateCoords(newCoords) {
  storedCoords.value[dock.value || 'default'] = newCoords
  if (dock.value) { // reposition body while dragging docked window
    repositionBody()
  }
}


function repositionBody() {
  const currentCoords = storedCoords.value[dock.value]

  switch (dock.value) {
  case 'top':
    document.body.style.marginTop = Math.max(parseInt(currentCoords.height), 0) + 'px'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = 'initial'
    break
  case 'bottom':
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = Math.max(parseInt(currentCoords.height), 0) + 'px'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = 'initial'
    break
  case 'left':
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = Math.max(parseInt(currentCoords.width), 0) + 'px'
    document.body.style.marginRight = 'initial'
    break
  case 'right':
    document.body.style.marginTop = 'initial'
    document.body.style.marginBottom = 'initial'
    document.body.style.marginLeft = 'initial'
    document.body.style.marginRight = Math.max(parseInt(currentCoords.width), 0) + 'px'
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


const isTransparent = ref(false)

const currentIcon = computed(() => {
  switch (dock.value) {
  case 'bottom':
    return 'mdi:dock-bottom'
  case 'top':
    return 'mdi:dock-top'
  case 'left':
    return 'mdi:dock-left'
  case 'right':
    return 'mdi:dock-right'
  default:
    return 'mdi:dock-window'
  }
})
</script>

<template>
  <Teleport :to="props.container">
    <form
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
          'UiWindow--transparent': isOpen && isTransparent
        },
        `UiWindow--docked-${dock}`
      ]"
    >
      <!-- DOCK ZONES -->
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
        v-model:isMoving="isMoving"
        :coords="storedCoords[dock ? dock : 'default']"
        class="UiWindow__box"
        @update:coords="onResizableUpdateCoords"
        @move-end="onResizableMoveEnd"
        @end="onResizableEnd"
      >
        <div class="UiWindow__header">
          <slot name="corner" />

          <div
            class="UiWindow__dragger"
            @mousedown="startMove"
            @touchstart="startMove"
          >
            <slot name="header" />
          </div>

          <slot name="controls" />

          <!-- <UiIcon
            v-show="!dock"
            class="UiWindow__eyeIcon"
            src="mdi:eye-outline"
            @mouseenter="isTransparent = true"
            @mouseleave="isTransparent = false"
          /> -->

          <UiPopover>
            <template #trigger>
              <UiIcon :src="currentIcon" />
            </template>
            <template #contents="popover">
              <div
                class="UiWindow__dockPicker"
                @click="popover.close()"
              >
                <UiIcon
                  src="mdi:dock-window"
                  class="UiWindow__dockIcon"
                  :class="{ 'UiWindow__dockIcon--active': !dock }"
                  @click="dockTo(null)"
                />

                <UiIcon
                  src="mdi:dock-bottom"
                  class="UiWindow__dockIcon"
                  :class="{ 'UiWindow__dockIcon--active': dock == 'bottom' }"
                  @click="dockTo('bottom')"
                />

                <UiIcon
                  src="mdi:dock-top"
                  class="UiWindow__dockIcon"
                  :class="{ 'UiWindow__dockIcon--active': dock == 'top' }"
                  @click="dockTo('top')"
                />

                <UiIcon
                  src="mdi:dock-left"
                  class="UiWindow__dockIcon"
                  :class="{ 'UiWindow__dockIcon--active': dock == 'left' }"
                  @click="dockTo('left')"
                />

                <UiIcon
                  src="mdi:dock-right"
                  class="UiWindow__dockIcon"
                  :class="{ 'UiWindow__dockIcon--active': dock == 'right' }"
                  @click="dockTo('right')"
                />

                <!-- <UiIcon
                src="mdi:window-restore"
                class="UiWindow__dockIcon"
                :class="{'--acUiWindow__dockIcontive': dock == 'popup'}"
                @click="dockTo('popup')"
                />-->
              </div>
            </template>
          </UiPopover>

          <UiIcon
            src="mdi:close"
            @click="cancel"
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
    </form>
  </Teleport>
</template>

<style lang="scss">
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
</style>