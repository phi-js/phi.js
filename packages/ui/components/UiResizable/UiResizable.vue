<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  /**
   * Objeto con las propiedades CSS que este componente modifica: top, left, width y hegiht
   */
  coords: {
    type: Object,
    required: false,
    default: null,
  },

  minWidth: {
    type: [String, Number],
    required: false,
    default: 128,
  },

  minHeight: {
    type: [String, Number],
    required: false,
    default: 128,
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

const bounds = reactive({
  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined,
})

const newBounds = reactive({ ...bounds })

watch(
  () => props.coords,
  () => {
    parseProps()
  },
  // no puede ser immediate, porque durante la primera ejecucion no existe getboundingClientRect
)
onMounted(() => {
  parseProps()
})

async function parseProps() {
  if (props?.coords) {
    let hasRawCss = false
    props.coords && Object.values(props.coords).forEach((coordValue) => {
      if (typeof coordValue !== 'string' || coordValue.substr(-2) != 'px') {
        hasRawCss = true
      }
    })

    if (hasRawCss) {
      // set element styles directly first ...
      rootEl.value.top = props.coords.top
      rootEl.value.left = props.coords.left
      rootEl.value.width = props.coords.width
      rootEl.value.height = props.coords.height
      rootEl.value.bottom = props.coords.bottom
      rootEl.value.right = props.coords.right

      // and then get the element size in pixels after next tick
      await nextTick()
      obtainElementBounds()

      emit('update:coords', {
        top: newBounds.top + 'px',
        left: newBounds.left + 'px',
        width: newBounds.width + 'px',
        height: newBounds.height + 'px',
      })
      return
    }

    newBounds.top = parseInt(props.coords.top)
    newBounds.left = parseInt(props.coords.left)
    newBounds.width = parseInt(props.coords.width)
    newBounds.height = parseInt(props.coords.height)
  } else {
    obtainElementBounds()
  }
}

function obtainElementBounds() {
  const elBounds = rootEl.value.getBoundingClientRect()

  bounds.top = rootEl.value.offsetTop
  bounds.left = rootEl.value.offsetLeft
  bounds.width = elBounds.width
  bounds.height = elBounds.height

  newBounds.top = bounds.top
  newBounds.left = bounds.left
  newBounds.width = bounds.width
  newBounds.height = bounds.height
}

const isDragging = ref(false)
const start = reactive({ x: null, y: null })
const zone = ref(null)

const elementStyle = computed(() => {
  if (!isDragging.value) {
    return props.coords
  }

  return {
    top: newBounds.top + 'px',
    left: newBounds.left + 'px',
    width: newBounds.width + 'px',
    height: newBounds.height + 'px',
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

  obtainElementBounds()

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

  switch (zone.value) {
  case 'move':
    newBounds.top = bounds.top + diff.y
    newBounds.left = bounds.left + diff.x
    break

  case 'n':
    newBounds.top = bounds.top + diff.y
    newBounds.height = bounds.height - diff.y
    break

  case 'ne':
    newBounds.top = bounds.top + diff.y
    newBounds.height = bounds.height - diff.y

    newBounds.width = bounds.width + diff.x
    break

  case 'e':
    newBounds.width = bounds.width + diff.x
    break

  case 'se':
    newBounds.width = bounds.width + diff.x
    newBounds.height = bounds.height + diff.y
    break

  case 's':
    newBounds.height = bounds.height + diff.y
    break

  case 'sw':
    newBounds.height = bounds.height + diff.y

    newBounds.left = bounds.left + diff.x
    newBounds.width = bounds.width - diff.x
    break

  case 'w':
    newBounds.left = bounds.left + diff.x
    newBounds.width = bounds.width - diff.x
    break

  case 'nw':
    newBounds.top = bounds.top + diff.y
    newBounds.height = bounds.height - diff.y

    newBounds.left = bounds.left + diff.x
    newBounds.width = bounds.width - diff.x
    break
  }

  // Restrictions
  newBounds.width = Math.max(newBounds.width, props.minWidth)
  newBounds.height = Math.max(newBounds.height, props.minHeight)

  if (zone.value != 'move') {
    newBounds.top = Math.min(newBounds.top, bounds.top + bounds.height - props.minHeight)
    newBounds.left = Math.min(newBounds.left, bounds.left + bounds.width - props.minWidth)
  }

  emit('step', {
    top: newBounds.top + 'px',
    left: newBounds.left + 'px',
    width: newBounds.width + 'px',
    height: newBounds.height + 'px',
  })

  emit('update:coords', {
    top: newBounds.top + 'px',
    left: newBounds.left + 'px',
    width: newBounds.width + 'px',
    height: newBounds.height + 'px',
  })
}

function onResizerEnd() {
  window.removeEventListener('mousemove', onResizerMove)
  window.removeEventListener('touchmove', onResizerMove)
  window.removeEventListener('mouseup', onResizerEnd)
  window.removeEventListener('touchend', onResizerEnd)

  bounds.top = newBounds.top
  bounds.left = newBounds.left
  bounds.width = newBounds.width
  bounds.height = newBounds.height

  emit('update:coords', {
    top: bounds.top + 'px',
    left: bounds.left + 'px',
    width: bounds.width + 'px',
    height: bounds.height + 'px',
  })

  isDragging.value = false
  emit('update:isDragging', isDragging.value)
  if (zone.value == 'move') {
    emit('update:isMoving', false)
    emit('moveEnd') // emitir DESPUES de update:coords
  }

  emit('end')
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
      :startMove="startMove"
      :styles="elementStyle"
      :newBounds="newBounds"
      :isDragging="isDragging"
      :refresh="obtainElementBounds"
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