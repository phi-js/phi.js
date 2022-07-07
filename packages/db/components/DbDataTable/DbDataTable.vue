<script setup>
import { reactive, watch, computed, ref } from 'vue'
import { UiOutput, UiPopover, UiItem, UiDialog } from '@/packages/ui'
import { getProperty } from '@/packages/ui/helpers'

import DbColumnEditor from '../DbColumnManager/DbColumnEditor.vue'
import DbColumnManager from '../DbColumnManager/DbColumnManager.vue'

const props = defineProps({
  /* Array of arbitrary JSON objects */
  records: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  Array of available columns
  [
    {
      ... column object
      The column object is a JSON SCHEMA, with an added "property" property
      and an added "enabled" property

      "title": "Fecha"
      "type": "integer",
      "format": "date",

      "property": "objrecord.date",
      "enabled": true
    }
  ]
  */
  columns: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  [
    { property: 'id', desc: true },
    { property: 'record.question2', desc: false },
    { property: 'foo', desc: true }
  ]
  */
  order: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['click-record', 'update:columns', 'update:order', 'scroll-bottom'])

const inner = reactive({
  columns: props.columns,
  order: props.order,
})

watch(
  () => props.columns,
  (newValue) => inner.columns = newValue,
  { immediate: true },
)

const visibleColumns = computed(() => {
  return inner.columns
    .map((c, index) => ({ ...c, _i: index }))
    .filter((c) => typeof c.enabled === 'undefined' || c.enabled)
})

watch(
  () => props.order,
  (newValue) => {
    if (Array.isArray(newValue) && newValue.length) {
      inner.order = newValue
    } else {
      inner.order = []
    }
  },
  { immediate: true },
)

/*
A hashed object of cell values:
columnValues[record index][column index] = the record's value for the column's property
*/
const columnValues = computed(() => {
  const retval = {}
  props.records.forEach((record, recordIndex) => {
    if (typeof retval[recordIndex] == 'undefined') {
      retval[recordIndex] = {}
    }

    inner.columns.forEach((column, columnIndex) => {
      retval[recordIndex][columnIndex] = getProperty(record, column.property)
    })
  })

  return retval
})

/*
A hashed object of column order
columnOrder[columnIndex] = asc | desc | null
*/
const columnOrder = computed(() => {
  const retval = {}
  inner.columns.forEach((column, columnIndex) => {
    const foundOrder = inner.order.find((o) => o.property == column.property)
    if (foundOrder) {
      retval[columnIndex] = foundOrder.desc ? 'desc' : 'asc'
    } else {
      retval[columnIndex] = null
    }
  })

  return retval
})

function onClickHeader($event, column) {
  const foundOrder = inner.order.find((o) => o.property == column.property)
  if (!foundOrder) {
    if (!$event.ctrlKey) {
      inner.order = []
    }

    inner.order.push({
      property: column.property,
      desc: false,
    })
  } else {
    if ($event.ctrlKey) {
      inner.order.splice(inner.order.indexOf(foundOrder), 1)
    } else {
      foundOrder.desc = !foundOrder.desc
    }
  }

  emit('update:order', inner.order)
}

function emitUpdate() {
  emit('update:columns', inner.columns)
  return true
}


/* Column editor */
const editingColumnIndex = ref()



function hideColumn(column) {
  column.enabled = false
  emitUpdate()
}


/* Reorder columns with drag and drop */

const dropData = reactive({
  source: null, // source column index (column being dragged)
  target: null, // target column index (drop target)
  position: null, // before || after
})

function onHeaderDragStart(ev, columnIndex) {
  dropData.source = columnIndex
}

function onHeaderDragOver(ev, columnIndex) {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'

  if (columnIndex === dropData.source) {
    dropData.target = null
    return
  }

  if (dropData.target != columnIndex) {
    dropData.target = columnIndex
  }
  dropData.position = ev.offsetX < ev.target.offsetWidth / 2 ? 'before' : 'after'
}

function onHeaderDrop(ev) {
  ev.preventDefault()
  if (dropData.target == null) {
    return
  }

  let targetIndex = dropData.target + (dropData.position == 'after' ? 1 : 0)

  // compensate displacement
  if (dropData.source < targetIndex) {
    targetIndex--
  }

  // move element from source index to target index
  inner.columns.splice(targetIndex, 0, inner.columns.splice(dropData.source, 1)[0])

  emitUpdate()
}

function onHeaderDragEnd() {
  dropData.source = null
  dropData.target = null
  dropData.position = null
}

const isManagerOpen = ref(false)
</script>

<template>
  <div class="DbDataTable">
    <table class="DbDataTable__table">
      <thead>
        <tr>
          <th
            v-for="(column) in visibleColumns"
            :key="column._i"
            :title="column.title"
            @dragover="onHeaderDragOver($event, column._i)"
            @drop="onHeaderDrop($event)"
          >
            <div
              :style="{pointerEvents: dropData.target == column ? 'none' : 'initial'}"
              class="DbDataTable__header"
              :class="{
                'DbDataTable__header--ordered': columnOrder[column._i],
                'DbDataTable__header--ordered-asc': columnOrder[column._i] == 'asc',
                'DbDataTable__header--ordered-desc': columnOrder[column._i] == 'desc',

                'DbDataTable__header--dropping': dropData.target == column._i,
                'DbDataTable__header--dropping-before': dropData.target == column._i && dropData.position == 'before',
                'DbDataTable__header--dropping-after': dropData.target == column._i && dropData.position == 'after',
              }"
              draggable="true"
              @dragstart="onHeaderDragStart($event, column._i)"
              @dragend="onHeaderDragEnd()"
            >
              <div
                class="DbDataTable__header-title"
                @click="onClickHeader($event, inner.columns[column._i])"
              >
                {{ column.title }}
              </div>
              <UiPopover
                placement="bottom-end"
              >
                <template #trigger>
                  <UiItem
                    class="DbDataTable__header-trigger"
                    icon="mdi:dots-vertical"
                  />
                </template>
                <template #contents="{ close }">
                  <div class="DbDataTable__menuOptions">
                    <UiItem
                      icon="mdi:tune"
                      text="Options"
                      @click="editingColumnIndex = column._i; close()"
                    />
                    <UiItem
                      icon="mdi:close"
                      text="Hide column"
                      @click="hideColumn(inner.columns[column._i]); close()"
                    />
                    <UiItem
                      icon="mdi:cog"
                      text="Manage columns"
                      @click="isManagerOpen = true; close()"
                    />
                  </div>
                </template>
              </UiPopover>
            </div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(record, ri) in props.records"
          :key="ri"
        >
          <td
            v-for="(column) in visibleColumns"
            :key="column._i"
          >
            <UiOutput
              :value="columnValues[ri][column._i]"
              :schema="column"
            />
          </td>
        </tr>
      </tbody>
    </table>

    <UiDialog
      v-slot="{ close }"
      :open="editingColumnIndex != null"
      @close="editingColumnIndex = null"
    >
      <DbColumnEditor
        v-if="editingColumnIndex != null"
        :model-value="inner.columns[editingColumnIndex]"
        @accept="inner.columns[editingColumnIndex] = $event; emitUpdate() && close()"
        @cancel="close()"
      />
    </UiDialog>

    <UiDialog v-model:open="isManagerOpen">
      <DbColumnManager
        v-if="isManagerOpen"
        v-model="inner.columns"
        @update:model-value="emitUpdate"
      />
    </UiDialog>
  </div>
</template>

<style lang="scss">
.DbDataTable {
  overflow: auto;

  --table-cell-padding: 2px 5px;
  // --row-color-light: #f7f7f7;
  // --row-color-dark: #f0f0f0;

  &__header-title {
    flex: 1;
    align-self: stretch;
    align-items: center;

    padding: var(--table-cell-padding);
    padding-right: 1rem;
    padding-top: 12px;
    padding-bottom: 12px;

    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__header {
    user-select: none;
    cursor: pointer;

    display: flex;
    align-items: center;

    &--ordered {
      &::before {
        color: var(--ui-color-primary);
      }

      &-asc::before {
        content: '\25B4' // up arrow triangle
      }

      &-desc::before {
        content: '\25BE' // down arrow triangle
      }
    }

    --dropzone-width: 5px;

    &--dropping {
      &-before {
        border-left: var(--dropzone-width) solid var(--ui-color-primary) !important;
        margin-left: calc(-1 * var(--dropzone-width));
      }
      &-after {
        border-right: var(--dropzone-width) solid var(--ui-color-primary) !important;
        margin-right: calc(-1 * var(--dropzone-width));
      }
    }

    &-trigger {
      opacity: 0;
    }

    &:hover &-trigger {
      opacity: 1;
    }
  }

  &__menuOptions {
    --ui-item-padding: 3px 6px;

    .UiItem {
      cursor: pointer;
    }
  }

  &__table {
    position: relative;
    border-spacing: 0;
    width: 100%;

    th {
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;
    }

    th,
    td {
      white-space: nowrap;

      border-right: 1px solid #ddd;
      &:last-child {
        border-right: none;
      }
    }

    .UiOutput {
      padding: var(--table-cell-padding);
    }

    thead {
      position: sticky;
      top: 0;
      z-index: 2;

      tr {
        background-color: var(--row-color-dark);
      }
    }

    tbody {
      tr {
        background-color: var(--row-color-light);
      }
      tr:nth-child(even) {
        background-color: var(--row-color-dark);
      }
    }

    th:first-child,
    td:first-child {
      position: sticky;
      left: 0;
      background-color: inherit;
      z-index: 2;
    }
  }
}
</style>