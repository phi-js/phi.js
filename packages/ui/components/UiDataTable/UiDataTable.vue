<script setup>
import { reactive, watch, computed, ref } from 'vue'
import { useI18n } from '@/packages/i18n'

import { UiOutput, UiPopover, UiItem, UiIntersectionObserver } from '../'
import { getProperty } from '../../helpers'

import deduceColumns from './deduceColumns'

const props = defineProps({
  /* Array of arbitrary JSON objects */
  records: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  Array of available columns
  see ./samples/columns.js
  */
  columns: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  [
    { value: '$.id', desc: true },
    { value: '$.record.question2', desc: false },
    { value: '$.foo', desc: true }
  ]
  */
  order: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['click-record', 'update:order', 'scroll-bottom'])

const i18n = useI18n({
  en: {
    'UiDataTable.HideColumn': 'Hide',
    'UiDataTable.Expand': 'Expand',
    'UiDataTable.Collapse': 'Collapse',
  },
  es: {
    'UiDataTable.HideColumn': 'Ocultar',
    'UiDataTable.Expand': 'Expandir',
    'UiDataTable.Collapse': 'Colapsar',
  },
  de: {
    'UiDataTable.HideColumn': 'Ausblenden',
    'UiDataTable.Expand': 'Erweitern Sie',
    'UiDataTable.Collapse': 'Kollabieren',
  },
})

const inner = reactive({ order: props.order })

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

const allColumns = computed(() => {
  const retval = (!props.columns?.length && props.records?.length)
    ? deduceColumns(props.records)
    : props.columns

  return retval.map((col, index) => ({
    ...col,
    _index: index,
  }))
})


/*
The list, and order, in which columns are to be shown.
Items in the array correspond to the column's _index.

e.g. only columns 1, 3 and 4 are shown, in the order: 4,3,1
columnLayout = [3,2,0]
*/
const columnLayout = reactive([])

const visibleColumns = computed(() => {
  if (!columnLayout.length) {
    return allColumns.value
  }

  return columnLayout.map((colIndex) => allColumns.value[colIndex])
})


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

    allColumns.value.forEach((column, columnIndex) => {
      retval[recordIndex][columnIndex] = getProperty(record, column.value)
    })
  })

  return retval
})

/*
A hashed object of column order
columnSort[columnIndex] = 'asc' | 'desc' | null
*/
const columnSort = computed(() => {
  const retval = {}
  allColumns.value.forEach((column, columnIndex) => {
    const foundOrder = inner.order.find((o) => o.field == column.sortable)
    if (foundOrder) {
      retval[columnIndex] = foundOrder.desc ? 'desc' : 'asc'
    } else {
      retval[columnIndex] = null
    }
  })

  return retval
})

function onClickHeader($event, column) {
  if (!column.sortable) {
    return
  }

  const foundOrder = inner.order.find((o) => o.field == column.sortable)
  if (!foundOrder) {
    if (!$event.ctrlKey) {
      inner.order = []
    }

    inner.order.push({
      field: column.sortable,
      desc: false,
    })
  } else {
    if ($event.ctrlKey) {
      inner.order.splice(inner.order.indexOf(foundOrder), 1)
    } else {
      foundOrder.desc = !foundOrder.desc
    }
  }

  emit('update:order', inner.order.concat([]))
}


/* Reorder columns with drag and drop */

const dropData = reactive({
  source: null, // source column _index (column being dragged)
  target: null, // target column _index (drop target)
  position: null, // before || after
})

function onHeaderDragStart(ev, visibleColumnIndex) {
  dropData.source = visibleColumnIndex
}

function onHeaderDragOver(ev, visibleColumnIndex) {
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'move'

  if (visibleColumnIndex === dropData.source) {
    dropData.target = null
    return
  }

  if (dropData.target != visibleColumnIndex) {
    dropData.target = visibleColumnIndex
  }
  dropData.position = ev.offsetX < ev.target.offsetWidth / 2 ? 'before' : 'after'
}

function onHeaderDrop(ev) {
  ev.preventDefault()

  if (dropData.target == null) {
    return
  }

  if (!columnLayout.length) {
    allColumns.value.forEach((column) => columnLayout.push(column._index))
  }

  let sourceIndex = dropData.source
  let targetIndex = dropData.target + (dropData.position == 'after' ? 1 : 0)

  // compensate displacement
  if (dropData.source < targetIndex) {
    targetIndex--
  }
  // move element from source index to target index
  columnLayout.splice(targetIndex, 0, columnLayout.splice(sourceIndex, 1)[0])
}

function onHeaderDragEnd() {
  dropData.source = null
  dropData.target = null
  dropData.position = null
}

function hideColumn(visibleColumnIndex) {
  if (!columnLayout.length) {
    allColumns.value.forEach((column) => columnLayout.push(column._index))
  }
  columnLayout.splice(visibleColumnIndex, 1)
}

const hiddenColumns = computed(() => {
  if (!columnLayout.length) {
    return []
  }

  return allColumns.value.filter((column) => !columnLayout.includes(column._index))
})

const isFullscreen = ref(false)
watch(
  isFullscreen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = null
    }
  },
)
</script>

<template>
  <div
    class="UiDataTable"
    :class="{
      'UiDataTable--fullscreen': isFullscreen,
      'UiDataTable--dragging': !!dropData.source,
    }"
  >
    <header class="UiDataTable__toolbar">
      <slot name="toolbar" />

      <div class="UiDataTable__toolbar-right">
        <!-- Hidden column explorer -->
        <UiPopover v-if="hiddenColumns.length">
          <template #trigger>
            <UiItem
              :badge="hiddenColumns.length"
              class="UiDataTable__toolbarItem"
              icon="mdi:view-column"
              :title="hiddenColumns.length + ' hidden columns'"
            />
          </template>
          <template #contents>
            <div class="UiDataTable__menuOptions">
              <UiItem
                v-for="hiddenColumn in hiddenColumns"
                :key="hiddenColumn._index"
                icon="mdi:eye"
                :text="hiddenColumn.title"
                :title="`Show ${hiddenColumn.title}`"
                @click.stop="columnLayout.push(hiddenColumn._index)"
              />
            </div>
          </template>
        </UiPopover>


        <!-- Toggle "fullscreen" -->
        <UiItem
          class="UiDataTable__toolbarItem UiDataTable__toolbarItem--fullscreen"
          :icon="isFullscreen ? 'mdi:fullscreen-exit' : 'mdi:fullscreen'"
          :title="i18n.t(isFullscreen ? 'UiDataTable.Collapse' : 'UiDataTable.Expand')"
          @click="isFullscreen = !isFullscreen"
        />
      </div>
    </header>

    <div class="UiDataTable__body">
      <table class="UiDataTable__table">
        <thead>
          <tr>
            <th
              v-for="(column, vci) in visibleColumns"
              :key="column._index"
              :title="column.title"
              :class="column.class"
              @dragover="onHeaderDragOver($event, vci)"
              @drop="onHeaderDrop($event)"
            >
              <div
                :style="{pointerEvents: dropData.target == column ? 'none' : 'initial'}"
                class="UiDataTable__header"
                :class="{
                  'UiDataTable__header--ordered': columnSort[column._index],
                  'UiDataTable__header--ordered-asc': columnSort[column._index] == 'asc',
                  'UiDataTable__header--ordered-desc': columnSort[column._index] == 'desc',

                  'UiDataTable__header--dropping': dropData.target == vci,
                  'UiDataTable__header--dropping-before': dropData.target == vci && dropData.position == 'before',
                  'UiDataTable__header--dropping-after': dropData.target == vci && dropData.position == 'after',
                }"
                draggable="true"
                @dragstart="onHeaderDragStart($event, vci)"
                @dragend="onHeaderDragEnd()"
              >
                <div
                  class="UiDataTable__header-title"
                  @click="onClickHeader($event, column)"
                >
                  {{ column.title }}
                </div>
                <UiPopover
                  placement="bottom-end"
                  class="UiDataTable__columnPopup"
                >
                  <template #trigger>
                    <UiItem icon="mdi:dots-vertical" />
                  </template>
                  <template #contents="{ close }">
                    <div class="UiDataTable__menuOptions">
                      <slot
                        name="column-popup"
                        :column="column"
                        :close="close"
                      />
                      <UiItem
                        icon="mdi:close"
                        :text="i18n.t('UiDataTable.HideColumn')"
                        @click="hideColumn(vci); close()"
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
            @click="emit('click-record', record)"
          >
            <td
              v-for="column in visibleColumns"
              :key="column._index"
              :style="{'--ui-table-title': `'${column.title}'`}"
              :class="column.class"
            >
              <UiOutput
                class="UiDataTable__output"
                v-bind="column"
                :value="columnValues[ri][column._index]"
              />
            </td>
          </tr>

          <tr v-if="props.records?.length">
            <td :colspan="visibleColumns.length">
              <UiIntersectionObserver @show="emit('scroll-bottom')">
                <slot name="bottom" />
              </UiIntersectionObserver>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>