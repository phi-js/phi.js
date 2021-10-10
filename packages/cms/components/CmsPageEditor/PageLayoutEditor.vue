<script setup>
import { ref, reactive, watch } from 'vue'
import { CmsBlockPicker } from '../CmsBlockPicker'
import draggable from 'vuedraggable'

const props = defineProps({
  page: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:page'])

const innerPage = ref(null)
watch(
  () => props.page,
  (newValue) => innerPage.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true, deep: true },
)

const isDragging = ref(false)
function onDraggableStart() {
  isDragging.value = true
}

function onDraggableEnd() {
  isDragging.value = false
}

function onDraggableUpdate() {
  innerPage.value.sections[0] = clearEmptyColumns(innerPage.value.sections[0])
  emit('update:page', innerPage.value)
}

// Creacion de columnas al arrastrar bloques a la izquierda o derecha del row (drop en ghost)
var uidGenerator = 0
const filler = ref([])

function onGhostAdd(evt, rowIndex, colIndex = null) {
  const block = filler.value[0]
  filler.value = []
  const createdColumn = colIndex !== null
    ? createColumn(rowIndex, colIndex)
    : createRow(rowIndex)

  createdColumn.blocks.push(block)
  emit('update:page', innerPage.value)
}

function createRow(targetIndex = 0) {
  let newRow = {
    id: uidGenerator++,
    title: 'new row',
    class: '',
    columns: [
      {
        id: uidGenerator++,
        title: 'new column',
        flex: 1,
        class: '',
        blocks: [],
      },
    ],
  }

  innerPage.value.sections[0].rows.splice(targetIndex, 0, newRow)
  return newRow.columns[0]
}

function createColumn(rowIndex, colIndex) {
  let newColumn = {
    id: uidGenerator++,
    title: 'new column',
    flex: 1,
    class: '',
    blocks: [],
  }

  innerPage.value.sections[0].rows[rowIndex].columns.splice(colIndex, 0, newColumn)
  return newColumn
}

function clearEmptyColumns(section) {
  let rows = []
  for (let rowIndex = 0; rowIndex < section.rows.length; rowIndex++) {
    let row = section.rows[rowIndex]
    let rowColumns = []
    for (let colIndex = 0; colIndex < row.columns.length; colIndex++) {
      let column = row.columns[colIndex]
      if (column?.blocks?.length) {
        rowColumns.push(column)
      }
    }

    row.columns = rowColumns
    if (row.columns.length) {
      rows.push(row)
    }
  }

  section.rows = rows
  return section
}


function onBlockPickerInput(block, column) {
  column.blocks.push(block)
  emit('update:page', innerPage.value)
}

// Gestion de resize de columnas
const resizerData = reactive({
  el: null,
  isResizing: false,
  initialX: null,
  targetColumn: null,
  nextColumn: null,
})
const isResizing = ref(false)

function onResizerStart(evt, rowIndex, colIndex) {
  evt.preventDefault()
  let targetColumn = innerPage.value.sections[0].rows[rowIndex].columns[colIndex]
  let nextColumn = innerPage.value.sections[0].rows[rowIndex].columns[colIndex + 1]
  if (!nextColumn) {
    return
  }
  isResizing.value = true

  // Set the "flex" property in all the row's columns
  let rowEl = evt.target.closest('.CmsPageLayoutEditor__row')
  let rowColumns = rowEl.querySelectorAll('.column-contents')

  for (let i = 0; i < rowColumns.length; i++) {
    let columnEl = rowColumns[i]
    innerPage.value.sections[0].rows[rowIndex].columns[i].flex = columnEl.offsetWidth
  }

  targetColumn.initialFlex = targetColumn.flex
  nextColumn.initialFlex = nextColumn.flex

  let x = evt.type == 'touchstart' ? evt.touches[0].clientX : evt.clientX
  let y = evt.type == 'touchstart' ? evt.touches[0].clientY : evt.clientY

  resizerData.el = evt.target
  resizerData.initialX = x
  resizerData.targetColumn = targetColumn
  resizerData.nextColumn = nextColumn

  resizerData.el.style.setProperty('--resizer-x', `${x}px`)
  resizerData.el.style.setProperty('--resizer-y', `${y}px`)
  resizerData.el.style.setProperty('--resizer-diff', '\'0\'')
}

function onResizerMove(evt) {
  if (!isResizing.value) {
    return
  }
  evt.preventDefault()

  let x = evt.type == 'touchmove' ? evt.touches[0].clientX : evt.clientX
  let y = evt.type == 'touchmove' ? evt.touches[0].clientY : evt.clientY
  let diff = x - resizerData.initialX

  resizerData.targetColumn.flex = resizerData.targetColumn.initialFlex + diff
  resizerData.nextColumn.flex = resizerData.nextColumn.initialFlex - diff

  resizerData.el.style.setProperty('--resizer-x', `${x}px`)
  resizerData.el.style.setProperty('--resizer-y', `${y}px`)
  resizerData.el.style.setProperty('--resizer-flex-before', `'${resizerData.targetColumn.flex}'`)
  resizerData.el.style.setProperty('--resizer-flex-after', `'${resizerData.nextColumn.flex}'`)
  resizerData.el.style.setProperty('--resizer-diff', `'${diff}'`)
}

function onResizerEnd(evt) {
  if (!isResizing.value) {
    return
  }
  evt.preventDefault()
  isResizing.value = false
  emit('update:page', innerPage.value)
  resizerData.el.style.setProperty('--resizer-diff', '')
}
</script>

<template>
  <div
    class="CmsPageLayoutEditor"
    :class="{
      'CmsPageLayoutEditor--dragging': isDragging,
      'CmsPageLayoutEditor--resizing': isResizing,
    }"
    @mousemove="onResizerMove($event)"
    @mouseup="onResizerEnd($event)"
    @touchmove="onResizerMove($event)"
    @touchend="onResizerEnd($event)"
  >
    <div
      v-for="(section, sectionIndex) in innerPage.sections"
      :key="section.id"
      class="CmsPageLayoutEditor__section Story__section"
      :class="section.class"
    >
      <div
        v-for="(row, rowIndex) in section.rows"
        :key="row.id"
        class="CmsPageLayoutEditor__row"
        :class="row.class"
      >
        <div class="CmsPageLayoutEditor__column CmsPageLayoutEditor__column--ghost">
          <draggable
            v-model="filler"
            class="CmsPageLayoutEditor__draggable"
            group="column-block"
            item-key="id"
            @update:modelValue="onGhostAdd($event, rowIndex, 0)"
          >
            <template #item>
              <div>placeholder</div>
            </template>
          </draggable>
        </div>

        <div
          v-for="(column, colIndex) in row.columns"
          :key="column.id"
          class="CmsPageLayoutEditor__column"
          :class="column.class"
          :style="{flex: column.flex}"
        >
          <div
            v-if="colIndex < row.columns.length - 1"
            class="CmsPageLayoutEditor__resizer"
            @mousedown="onResizerStart($event, rowIndex, colIndex)"
            @touchstart="onResizerStart($event, rowIndex, colIndex)"
          >
            <div class="CmsPageLayoutEditor__resizer__tooltip" />
          </div>

          <draggable
            v-model="column.blocks"
            class="CmsPageLayoutEditor__draggable column-contents"
            group="column-block"
            item-key="id"
            handle=".BlockEditorLayout__handle"
            :animation="111"
            :empty-insert-threshold="0"
            :swap-threshold="0.25"

            @update:modelValue="onDraggableUpdate"
            @start="onDraggableStart($event, column)"
            @end="onDraggableEnd($event, rowIndex, colIndex)"
          >
            <template #item="{element, index}">
              <div
                class="CmsPageLayoutEditor__block"
                :class="element.class"
              >
                <slot
                  name="block"
                  :sectionIndex="sectionIndex"
                  :rowIndex="rowIndex"
                  :colIndex="colIndex"
                  :blockIndex="index"
                  :column="column"
                  :block="element"
                />
              </div>
            </template>
          </draggable>

          <CmsBlockPicker @input="onBlockPickerInput($event, column)" />
        </div> <!-- /column -->

        <div class="CmsPageLayoutEditor__column CmsPageLayoutEditor__column--ghost">
          <draggable
            v-model="filler"
            class="CmsPageLayoutEditor__draggable"
            group="column-block"
            item-key="id"
            @update:modelValue="onGhostAdd($event, rowIndex, row.columns.length)"
          >
            <template #item>
              <div>placeholder</div>
            </template>
          </draggable>
        </div>
      </div> <!--  /row -->
    </div>
  </div>
</template>

<style lang="scss">
.CmsPageLayoutEditor {
  &--dragging {
    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    .CmsBlockEditor {
      pointer-events: none;
    }
  }

  &--resizing {
    // show drag tooltip
    .CmsPageLayoutEditor__resizer__tooltip {
      opacity: 0.8;
    }
  }

  &__row {
    display: flex;
  }

  &__column {
    flex: 1;
    position: relative;

    &--ghost {
      flex: none;
    }

    .CmsPageLayoutEditor__draggable {
      min-width: 18px;
      // height: 100%;  // Causa un bug raro, los elementos debajo de .PageLayoutEditor se desplazan hacia arriba (?!)
    }
  }

  &__resizer {
    cursor: col-resize;

    position: absolute;
    top: 0;
    bottom: 0;
    right: -12px;
    width: 20px;
    z-index: 2;

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

      // border-left: 1px dashed rgba(0,0,0, 0.2);
      border-left: 2px dotted var(--ui-color-primary);
    }

    &::before {
      content: var(--resizer-diff);

      position: absolute;
      bottom: 100%;
      left: 0;
      right: 0;
      height: 21px;

      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-family: var(--ui-font-secondary);
    }


    &__tooltip {
      pointer-events: none;
      transition: opacity 200ms;
      opacity: 0; // se pone visible en --dragging

      display: flex;
      align-items: center;
      position: fixed;
      top: var(--resizer-y);
      left: var(--resizer-x);
      width: 96px;
      margin-top: -11px;
      margin-left: -48px; //(96px / 2) * -1;

      background: var(--ui-color-primary);
      border-radius: var(--ui-radius);
      font-size: 10px;
      color: #fff;

      &::before,
      &::after {
        flex: 1;
        text-align: center;
        padding: 3px 0;
      }

      &::before {
        content: var(--resizer-flex-before);
      }

      &::after {
        content: var(--resizer-flex-after);
      }
    }

  }
}
</style>