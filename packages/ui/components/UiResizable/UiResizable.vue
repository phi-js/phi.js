<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from 'vue'

const props = defineProps({
  /*
  Object containing the coordinates (int value, pixels)
  {
    top: 5,
    left: 5,
    width: 400,
    height: 300,
  }
  */
  coords: {
    type: Object,
    required: false,
    default: null,
  },

  minWidth: {
    type: [String, Number],
    required: false,
    default: 400,
  },

  minHeight: {
    type: [String, Number],
    required: false,
    default: 300,
  },

  /**
   * Lista de zonas habilitadas
   * e.g. ['s'],  solo habilita el resize desde hotzone Sur
   *
  */
  enabled: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits([
  'step',
  'update:coords',
  'update:isDragging',
  'moveStart',
  'moveEnd',
  'update:isMoving',
  'update:isResizing',
  'end',
])

const rootEl = ref()

const currentCoords = reactive({
  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined,
})
const initialCoords = ref()

onMounted(() => {
  if (props.coords) {
    currentCoords.top = props.coords.top
    currentCoords.left = props.coords.left
    currentCoords.width = props.coords.width
    currentCoords.height = props.coords.height
  } else {
    obtainElementCoords()
  }
})

watch(
  () => props.coords,
  () => {
    if (props.coords) {
      currentCoords.top = props.coords.top
      currentCoords.left = props.coords.left
      currentCoords.width = props.coords.width
      currentCoords.height = props.coords.height
    }
  },
)


function obtainElementCoords() {
  const elBounds = rootEl.value.getBoundingClientRect()
  currentCoords.top = Math.floor(rootEl.value.offsetTop)
  currentCoords.left = Math.floor(rootEl.value.offsetLeft)
  currentCoords.width = Math.floor(elBounds.width)
  currentCoords.height = Math.floor(elBounds.height)
}

async function reset() {
  currentCoords.top = undefined
  currentCoords.left = undefined
  currentCoords.width = undefined
  currentCoords.height = undefined

  await nextTick()
  obtainElementCoords()
}


const isDragging = ref(false)
const start = reactive({ x: null, y: null })
const zone = ref(null)

const elementStyle = computed(() => {
  return {
    top: currentCoords.top ? currentCoords.top + 'px' : undefined,
    left: currentCoords.left ? currentCoords.left + 'px' : undefined,
    width: currentCoords.width ? currentCoords.width + 'px' : undefined,
    height: currentCoords.height ? currentCoords.height + 'px' : undefined,
  }
})

const availableZones = computed(() => {
  const all = ['n', 'e', 's', 'w', 'ne', 'nw', 'se', 'sw']
  return props.enabled.length ? props.enabled : all
})

function onResizerStart(evt, targetZone) {
  evt.preventDefault()
  const pointer = evt.type == 'touchstart' ? evt.touches[0] : evt

  zone.value = targetZone

  start.x = pointer.clientX
  start.y = pointer.clientY

  obtainElementCoords()
  initialCoords.value = { ...currentCoords }

  isDragging.value = true
  emit('update:isDragging', isDragging.value)

  if (zone.value == 'move') {
    emit('update:isMoving', true)
    emit('moveStart')
  }

  window.addEventListener('mousemove', onResizerMove)
  window.addEventListener('touchmove', onResizerMove)
  window.addEventListener('mouseup', onResizerEnd)
  window.addEventListener('touchend', onResizerEnd)
}

function onResizerMove(evt) {
  evt.preventDefault()
  let pointer = evt.type == 'touchmove' ? evt.touches[0] : evt
  let diff = {
    x: pointer.clientX - start.x,
    y: pointer.clientY - start.y,
  }

  const targetCoords = { ...currentCoords }

  const viewport = {
    width: document.documentElement.clientWidth, // minds the scrollbar width
    height: window.innerHeight,
  }

  if (zone.value == 'move') {
    targetCoords.top = Math.max(initialCoords.value.top + diff.y, 0)
    targetCoords.left = Math.max(initialCoords.value.left + diff.x, 0)

    // Squish into viewport
    targetCoords.left = Math.min(targetCoords.left, viewport.width - props.minWidth)
    targetCoords.width = Math.min(
      Math.max(targetCoords.width, initialCoords.value.width),
      viewport.width - targetCoords.left,
    )

    targetCoords.top = Math.min(targetCoords.top, viewport.height - props.minHeight)
    targetCoords.height = Math.min(
      Math.max(targetCoords.height, initialCoords.value.height),
      viewport.height - targetCoords.top,
    )
  }

  // resize height from north
  if (['n', 'ne', 'nw'].includes(zone.value)) {
    targetCoords.top = Math.max(initialCoords.value.top + diff.y, 0)

    const offsetTop = initialCoords.value.top - targetCoords.top
    targetCoords.height = Math.max(initialCoords.value.height + offsetTop, props.minHeight)

    targetCoords.top = Math.min(
      targetCoords.top,
      initialCoords.value.top + initialCoords.value.height - targetCoords.height,
    )
  }

  // resize height from south
  if (['s', 'se', 'sw'].includes(zone.value)) {
    targetCoords.height = Math.max(initialCoords.value.height + diff.y, props.minHeight)
    targetCoords.height = Math.min(targetCoords.height, viewport.height - initialCoords.value.top)
  }

  // resize width from west
  if (['w', 'nw', 'sw'].includes(zone.value)) {
    targetCoords.left = Math.max(initialCoords.value.left + diff.x, 0)
    const offsetLeft = initialCoords.value.left - targetCoords.left
    targetCoords.width = Math.max(initialCoords.value.width + offsetLeft, props.minWidth)

    // eslint-disable-next-line max-len
    targetCoords.left = Math.min(targetCoords.left, initialCoords.value.left + initialCoords.value.width - targetCoords.width)
  }

  // resize width from east
  if (['e', 'ne', 'se'].includes(zone.value)) {
    targetCoords.width = Math.max(initialCoords.value.width + diff.x, props.minWidth)
    targetCoords.width = Math.min(targetCoords.width, viewport.width - initialCoords.value.left)
  }


  currentCoords.top = Math.floor(targetCoords.top)
  currentCoords.left = Math.floor(targetCoords.left)
  currentCoords.width = Math.floor(targetCoords.width)
  currentCoords.height = Math.floor(targetCoords.height)
  emit('update:coords', { ...currentCoords })
}

function onResizerEnd() {
  window.removeEventListener('mousemove', onResizerMove)
  window.removeEventListener('touchmove', onResizerMove)
  window.removeEventListener('mouseup', onResizerEnd)
  window.removeEventListener('touchend', onResizerEnd)

  emit('update:coords', { ...currentCoords })

  isDragging.value = false
  emit('update:isDragging', isDragging.value)
  if (zone.value == 'move') {
    emit('update:isMoving', false)
    emit('moveEnd') // emitir DESPUES de update:coords
  }

  emit('end', { ...currentCoords })
}

function startMove(evt) {
  return onResizerStart(evt, 'move')
}
</script>

<template>
  <div
    ref="rootEl"
    class="UiResizable"
    :style="elementStyle"
  >
    <slot
      :coords="currentCoords"
      :startMove="startMove"
      :isDragging="isDragging"
      :reset="reset"
    />
    <div
      v-for="zoneName in availableZones"
      :key="zoneName"
      :class="`UiResizable__hotzone --${zoneName}`"
      @mousedown="onResizerStart($event, zoneName)"
      @touchstart="onResizerStart($event, zoneName)"
    />
  </div>
</template>

<style lang="scss">
.UiResizable {
  position: relative;
  --hotzone-size: 10px;
  --hotzone-offset: 4px; // distancia a desplazar el hotzone hacia afuera de la ventana

  &__hotzone {
    position: absolute;
    min-width: var(--hotzone-size);
    min-height: var(--hotzone-size);

    &.--n,
    &.--s {
      cursor: ns-resize;
      left: 0;
      right: 0;
    }

    &.--e,
    &.--w {
      cursor: ew-resize;
      top: 0;
      bottom: 0;
    }

    &.--ne,
    &.--nw,
    &.--n {
      top: calc(-1 * var(--hotzone-offset));
    }

    &.--se,
    &.--sw,
    &.--s {
      bottom: calc(-1 * var(--hotzone-offset));
    }

    &.--nw,
    &.--sw,
    &.--w {
      left: calc(-1 * var(--hotzone-offset));
    }

    &.--ne,
    &.--se,
    &.--e {
      right: calc(-1 * var(--hotzone-offset));
    }

    &.--n,
    &.--e,
    &.--s,
    &.--w {
      z-index: 1;
    }

    &.--nw,
    &.--se {
      cursor: nwse-resize;
    }

    &.--ne,
    &.--sw {
      cursor: nesw-resize;
    }

    &.--ne,
    &.--nw,
    &.--se,
    &.--sw {
      z-index: 2;
    }
  }
}
</style>