<script setup>
import { reactive, watch, computed, ref, nextTick } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiOutput, UiPopover, UiItem, UiIntersectionObserver, UiInput, UiIcon } from '../'
import { getProperty } from '../../helpers'
import deduceColumns from './deduceColumns'

const i18n = useI18n({
  en: {
    'UiDataTable.AllColumns': 'All columns',
    'UiDataTable.HideColumn': 'Hide',
    'UiDataTable.Expand': 'Expand',
    'UiDataTable.Collapse': 'Collapse',
  },
  es: {
    'UiDataTable.AllColumns': 'Todas las columnas',
    'UiDataTable.HideColumn': 'Ocultar',
    'UiDataTable.Expand': 'Expandir',
    'UiDataTable.Collapse': 'Colapsar',
  },
  de: {
    'UiDataTable.AllColumns': 'Alle Spalten',
    'UiDataTable.HideColumn': 'Ausblenden',
    'UiDataTable.Expand': 'Erweitern Sie',
    'UiDataTable.Collapse': 'Kollabieren',
  },
})

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

  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },

  maxTds: {
    type: [String, Number],
    required: false,
    default: 200,
  },
})

const emit = defineEmits(['click-record', 'update:order', 'scroll-bottom'])

/* Only render a batch of records at a time, and refresh when scrolling (i.e. allow thousands of records) */
const visibleWindow = ref()
watch(
  () => props.records,
  () => {
    visibleWindow.value = {
      batchSize: parseInt(props.maxTds), // only render [maxTds] <td>s at a time
      start: 0,
      length: parseInt(props.maxTds),
    }
  },
  { immediate: true },
)

const visibleRecords = computed(() => {
  if (!props.maxTds || props.maxTds <= 0) {
    return props.records
  }

  return props.records.slice(
    visibleWindow.value.start,
    visibleWindow.value.start + visibleWindow.value.length,
  )
})

function onHitBottom() {
  emit('scroll-bottom')
}

let atScrollTop = false
let atScrollBottom = false

const batchSize = Math.ceil(parseInt(props.maxTds) / 3)

function onBodyScroll(event) {
  const pixelsOnTop = event.target.scrollTop
  const pixelsOnBottom = event.target.scrollHeight - (event.target.scrollTop + event.target.offsetHeight)

  if (pixelsOnBottom < 200) {
    if (atScrollBottom) { // i'm already at the bottom hotzone. ignore
      return
    }
    atScrollBottom = true
    visibleWindow.value.start += batchSize
  } else {
    atScrollBottom = false
  }

  if (pixelsOnTop < 200) {
    if (atScrollTop) { // I'm already at top hotzone. ignore.
      return
    }
    atScrollTop = true
    visibleWindow.value.start = Math.max(0, visibleWindow.value.start - batchSize)
  } else {
    atScrollTop = false
  }
}




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


// Filter columns by "group" property
const availableGroups = computed(() => {
  const foundGroups = {} // hashed.  foundGroups[group name]: { group object }
  allColumns.value.forEach((column) => {
    if (!column.group) {
      return
    }
    if (!foundGroups[column.group]) {
      foundGroups[column.group] = {
        text: column.group,
        value: column.group,
        count: 0,
      }
    }
    foundGroups[column.group].count++
  })

  return Object.values(foundGroups)
})

const selectedGroup = ref(null)


/*
The list, and order, in which columns are to be shown.
Items in the array correspond to the column's _index.

e.g. only columns 1, 3 and 4 are shown, in the order: 4,3,1
columnLayout = [3,2,0]
*/
const columnLayout = reactive([])

const visibleColumns = computed(() => {
  const columnList = !columnLayout.length
    ? allColumns.value
    : columnLayout.map((colIndex) => allColumns.value[colIndex])

  if (!selectedGroup.value) {
    return columnList
  }

  return columnList.filter((col) => !col.group || col.group == selectedGroup.value)
})


/*
A hashed object of cell values:
columnValues[record index][column index] = the record's value for the column's property
*/
const columnValues = computed(() => {
  const retval = {}
  visibleRecords.value.forEach((record, recordIndex) => {
    if (typeof retval[recordIndex] == 'undefined') {
      retval[recordIndex] = {}
    }

    allColumns.value.forEach((column, columnIndex) => {
      // support callbacks as column values
      let targetValue = null
      if (typeof column.value == 'function') {
        targetValue = column.value(record)
      } else {
        targetValue = getProperty(record, column.value)
      }

      retval[recordIndex][columnIndex] = targetValue
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
    const foundOrder = inner.order.find((o) => o.field == column.orderBy)
    if (foundOrder) {
      retval[columnIndex] = foundOrder.desc ? 'desc' : 'asc'
    } else {
      retval[columnIndex] = null
    }
  })

  return retval
})

function onClickHeader($event, column) {
  if (!column.orderBy) {
    return
  }

  const foundOrder = inner.order.find((o) => o.field == column.orderBy)
  if (!foundOrder) {
    if (!$event.ctrlKey) {
      inner.order = []
    }

    inner.order.push({
      field: column.orderBy,
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
      'UiDataTable--loading': isLoading,
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

      <!-- Filter columns by group -->
      <UiInput
        v-if="availableGroups.length"
        v-model="selectedGroup"
        class="UiDataTable__columnSelect"
        type="select-native"
        :options="availableGroups"
        :placeholder="i18n.t('UiDataTable.AllColumns')"
      />
    </header>

    <div
      class="UiDataTable__body"
      @scroll="onBodyScroll"
    >
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

                <slot
                  name="column-icons"
                  :column="column"
                />

                <UiPopover
                  placement="bottom-end"
                  class="UiDataTable__columnPopup"
                >
                  <template #trigger>
                    <UiIcon
                      src="mdi:dots-vertical"
                      class="UiDataTable__columnIcon"
                    />
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
            v-for="(record, ri) in visibleRecords"
            :key="record?.id || ri"
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
              <UiIntersectionObserver @show="onHitBottom()">
                <slot name="bottom" />
              </UiIntersectionObserver>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>