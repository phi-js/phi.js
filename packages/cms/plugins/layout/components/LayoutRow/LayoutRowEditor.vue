<script setup>
import { ref, watch, reactive } from 'vue'
import { UiIcon } from '@/packages/ui/components'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import BlockScaffold from '../../../../components/CmsBlockEditor/BlockScaffold.vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block', 'delete'])

const columns = ref([])
watch(
  () => props.block?.slot,
  (newValue) => columns.value = Array.isArray(newValue) ? newValue : [],
  { immediate: true },
)

function onUpdateColumn() {
  // Remove empty columns
  if (columns.value.length > 1) {
    emit('update:block', { ...props.block, slot: columns.value.filter((column) => column?.slot?.length > 0) })
  } else {
    emit('update:block', { ...props.block, slot: columns.value.concat([]) })
  }
}

const filler = ref([])
function onUpdateGhost(colIndex, slotItems) {
  columns.value.splice(colIndex, 0, {
    component: 'LayoutColumn',
    props: { flex: 1 },
    slot: slotItems,
  })

  onUpdateColumn()
  filler.value = []
}


/// Column resizer:
const $el = ref()

const resizerData = reactive({
  el: null,
  initialX: null,

  target: {
    element: null,
    flex: null,
    initialFlex: null,
  },

  next: {
    element: null,
    flex: null,
    initialFlex: null,
  },
})
const isResizing = ref(false)

function onResizerStart(evt, colIndex) {
  evt.preventDefault()
  let nextColumn = columns.value[colIndex + 1]
  if (!nextColumn) {
    return
  }
  isResizing.value = true

  const elColumns = $el.value.querySelectorAll('.LayoutRowEditor__column')

  const colWidths = []
  for (const elColumn of elColumns) {
    colWidths.push(elColumn.offsetWidth)
  }

  resizerData.el = evt.target
  resizerData.initialX = evt.type == 'touchstart' ? evt.touches[0].clientX : evt.clientX
  resizerData.target.element = elColumns[colIndex]
  resizerData.target.flex = colWidths[colIndex]
  resizerData.target.initialFlex = colWidths[colIndex]
  resizerData.next.element = elColumns[colIndex + 1]
  resizerData.next.flex = colWidths[colIndex + 1]
  resizerData.next.initialFlex = colWidths[colIndex + 1]

  for (let i = 0; i < elColumns.length; i++) {
    const elColumn = elColumns[i]
    elColumn.style.setProperty('flex', colWidths[i])
  }
}

function onResizerMove(evt) {
  if (!isResizing.value) {
    return
  }
  evt.preventDefault()

  let x = evt.type == 'touchmove' ? evt.touches[0].clientX : evt.clientX
  let diff = x - resizerData.initialX

  resizerData.target.flex = resizerData.target.initialFlex + diff
  resizerData.next.flex = resizerData.next.initialFlex - diff

  resizerData.target.element.style.setProperty('flex', resizerData.target.flex)
  resizerData.next.element.style.setProperty('flex', resizerData.next.flex)
}

function onResizerEnd(evt) {
  if (!isResizing.value) {
    return
  }
  evt.preventDefault()
  isResizing.value = false

  const elColumns = $el.value.querySelectorAll('.LayoutRowEditor__column')
  columns.value.forEach((column, i) => {
    if (typeof column.props === 'undefined') {
      column.props = {}
    }
    column.props.flex = elColumns[i].offsetWidth
  })

  onUpdateColumn()
}

const isDragging = ref(false)
const draggedColumnIndex = ref(null)

function isLeftGhostVisible(colIndex) {
  if (colIndex === columns.value.length) {
    return (draggedColumnIndex.value < columns.value.length - 1)
      || columns.value[columns.value.length - 1]?.slot?.length > 1
  }

  if (colIndex === draggedColumnIndex.value) {
    return columns.value[colIndex].slot.length > 1
  }

  // The ghost to the right of the dragged column:
  if (colIndex === draggedColumnIndex.value + 1) {
    return columns.value[colIndex - 1]?.slot?.length > 1
  }

  return true
}
</script>

<template>
  <BlockScaffold
    class="LayoutRowEditor"
    :block="props.block"
    @update:block="emit('update:block', $event)"
    @delete="emit('delete')"
  >
    <template #toolbar>
      <template v-if="columns.length > 1">
        <UiIcon
          v-show="!props.block.props?.alignItems || props.block.props?.alignItems == 'flex-start'"
          class="BlockScaffold__toolbar-icon"
          src="mdi:align-vertical-top"
          @click="emit('update:block', {...props.block, props: {...props.block.props, alignItems: 'center'}})"
        />
        <UiIcon
          v-show="props.block.props?.alignItems == 'center'"
          class="BlockScaffold__toolbar-icon"
          src="mdi:align-vertical-center"
          @click="emit('update:block', {...props.block, props: {...props.block.props, alignItems: 'flex-end'}})"
        />
        <UiIcon
          v-show="props.block.props?.alignItems == 'flex-end'"
          class="BlockScaffold__toolbar-icon"
          src="mdi:align-vertical-bottom"
          @click="emit('update:block', {...props.block, props: {...props.block.props, alignItems: 'flex-start'}})"
        />
      </template>
    </template>

    <template #default="{ innerBlock }">
      <div
        ref="$el"
        class="LayoutRowEditor__body LayoutRow"
        :class="[{'LayoutRowEditor--dragging': isDragging}, innerBlock?.props?.class]"
        :style="{alignItems: props.block?.props?.alignItems, ...innerBlock?.props?.style}"
        @mousemove="onResizerMove($event)"
        @mouseup="onResizerEnd($event)"
        @touchmove="onResizerMove($event)"
        @touchend="onResizerEnd($event)"
      >
        <div class="ui__content">
          <template
            v-for="(column, colIndex) in columns"
            :key="colIndex"
          >
            <div
              v-show="isLeftGhostVisible(colIndex)"
              class="LayoutRowEditor__ghost"
            >
              <CmsSlotEditor
                v-model:dragging="isDragging"
                v-model:slot="filler"
                @update:slot="onUpdateGhost(colIndex, $event)"
              />
            </div>
            <div
              class="LayoutRowEditor__column LayoutColumn"
              :style="{flex: column?.props?.flex || 1}"
            >
              <CmsSlotEditor
                v-model:slot="column.slot"
                v-model:dragging="isDragging"
                show-launcher
                @update:slot="onUpdateColumn"
                @update:dragging="draggedColumnIndex = $event ? colIndex : null"
              />

              <div
                v-if="colIndex < columns.length - 1"
                class="LayoutRowEditor__resizer"
                @mousedown="onResizerStart($event, colIndex)"
                @touchstart="onResizerStart($event, colIndex)"
              />
            </div>
          </template>
          <div
            v-show="isLeftGhostVisible(columns.length)"
            class="LayoutRowEditor__ghost"
          >
            <CmsSlotEditor
              v-model:dragging="isDragging"
              v-model:slot="filler"
              @update:slot="onUpdateGhost(columns.length, $event)"
            />
          </div>
        </div>
      </div>
    </template>
  </BlockScaffold>
</template>

<style lang="scss">
.LayoutRowEditor {
  &__ghost {
    transition: all var(--ui-duration-snap);
    min-width: 0;
    border-radius: 2px;
    border: 0;

    .CmsSlotEditor,
    .CmsSlotEditor > div {
      height: 100%;
    }
  }

  &--dragging &__ghost {
    min-width: 18px;
    border: 1px dashed rgba(0,0,0, 0.2);
    background-color: rgba(0,0,0, 0.02);
  }

  &__column {
    position: relative;
  }

  &__resizer {
    cursor: col-resize;

    position: absolute;
    top: 0;
    bottom: 0;
    right: -12px;
    width: 20px;
    z-index: 1;

    transition: opacity 200ms;
    opacity: 0;
    &:hover {
      opacity: 1;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      bottom: 0;
      width: 1px;
      margin-left: -1px;
      border-left: 2px dotted var(--ui-color-primary);
    }
  }
}
</style>