<script setup>
import { ref, reactive, watch } from 'vue'
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


// Gestion de resize de columnas
const resizerData = reactive({
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

  resizerData.initialX = evt.type == 'touchstart' ? evt.touches[0].clientX : evt.clientX
  resizerData.targetColumn = targetColumn
  resizerData.nextColumn = nextColumn
}

function onResizerMove(evt) {
  if (!isResizing.value) {
    return
  }
  evt.preventDefault()

  let x = evt.type == 'touchmove' ? evt.touches[0].clientX : evt.clientX
  let diff = x - resizerData.initialX

  resizerData.targetColumn.flex = resizerData.targetColumn.initialFlex + diff
  resizerData.nextColumn.flex = resizerData.nextColumn.initialFlex - diff
}

function onResizerEnd(evt) {
  if (!isResizing.value) {
    return
  }
  evt.preventDefault()
  isResizing.value = false
  emit('update:page', innerPage.value)
}
</script>

<template>
  <div
    class="CmsPageLayoutEditor"
    :class="{'CmsPageLayoutEditor--dragging': isDragging}"
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
          />

          <draggable
            v-model="column.blocks"
            class="CmsPageLayoutEditor__draggable column-contents"
            group="column-block"
            item-key="id"
            handle=".BlockEditorLayout__handle"
            @update:modelValue="emit('update:page', innerPage)"
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
        </div>

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
    // border: 3px dashed red;

    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    .CmsBlockEditor {
      pointer-events: none;
    }
  }

  // &__section {
  //   border: 1px solid blue;
  // }

  &__row {
    // border: 1px solid orange;
    display: flex;
  }

  &__column {
    // border: 1px solid red;
    flex: 1;
    position: relative;

    &--ghost {
      flex: none;
    }

    .CmsPageLayoutEditor__draggable {
      min-width: 18px;
      height: 100%;
    }
  }

  &__resizer {
    // border: 3px solid red;
    cursor: col-resize;

    position: absolute;
    top: 0;
    bottom: 0;
    right: -12px;
    width: 24px;
    z-index: 2;
  }

  // &__block {
  //   border: 1px solid green;
  // }
}
</style>