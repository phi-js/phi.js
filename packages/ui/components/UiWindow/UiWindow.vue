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


const isTransparent = ref(false)
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
          'UiWindow--transparent': isOpen && isTransparent
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
      >
        <div class="UiWindow__header">
          <div
            class="UiWindow__dragger"
            @mousedown="startMove"
            @touchstart="startMove"
          >
            <slot name="header" />
          </div>

          <UiIcon
            v-show="!dock"
            class="UiWindow__eyeIcon"
            src="mdi:eye-outline"
            @mouseenter="isTransparent = true"
            @mouseleave="isTransparent = false"
          />

          <UiPopover>
            <template #trigger>
              <UiIcon
                :src="dock
                  ? (dock == 'popup' ? 'mdi:window-restore' : `mdi:dock-${dock}`)
                  : 'mdi:card-outline'"
              />
            </template>
            <template #contents="popover">
              <div
                class="UiWindow__dockPicker"
                @click="popover.close()"
              >
                <UiIcon
                  src="mdi:card-outline"
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