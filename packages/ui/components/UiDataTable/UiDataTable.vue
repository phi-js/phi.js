<script setup>
import { reactive, watch, computed, ref } from 'vue'
import { useI18n } from '@/packages/i18n'

import { UiInput, UiOutput, UiPopover, UiItem, UiDialog, UiIntersectionObserver } from '../'
import { getProperty } from '../../helpers'

import deduceColumns from './deduceColumns'
import ColumnManager from './ColumnManager.vue'
import TempValue from '../TempValue/TempValue.vue'

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

const emit = defineEmits(['click-record', 'update:columns', 'update:order', 'scroll-bottom'])

const i18n = useI18n({
  en: {
    'UiDataTable.HideColumn': 'Hide',
    'UiDataTable.Expand': 'Expand',
    'UiDataTable.Collapse': 'Collapse',
    'UiDataTable.OpenSettings': 'Manage columns',
  },
  es: {
    'UiDataTable.HideColumn': 'Ocultar',
    'UiDataTable.Expand': 'Expandir',
    'UiDataTable.Collapse': 'Colapsar',
    'UiDataTable.OpenSettings': 'Administrar columnas',
  },
  de: {
    'UiDataTable.HideColumn': 'Ausblenden',
    'UiDataTable.Expand': 'Erweitern Sie',
    'UiDataTable.Collapse': 'Kollabieren',
    'UiDataTable.OpenSettings': 'Spalten verwalten',
  },
})

const inner = reactive({
  columns: props.columns,
  order: props.order,
})

watch(
  () => props.columns,
  (newValue) => {
    inner.columns = newValue
  },
  { immediate: true },
)

watch(
  () => props.records,
  () => {
    if (!inner.columns?.length) {
      inner.columns = deduceColumns(props.records)
        .map((c) => ({ ...c, enabled: true }))

      emitUpdate()
    }
  },
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
      retval[recordIndex][columnIndex] = getProperty(record, column.value)
    })
  })

  return retval
})

/*
A hashed object of column order
columnOrder[columnIndex] = 'asc' | 'desc' | null
*/
const columnOrder = computed(() => {
  const retval = {}
  inner.columns.forEach((column, columnIndex) => {
    const foundOrder = inner.order.find((o) => o.value == column.value)
    if (foundOrder) {
      retval[columnIndex] = foundOrder.desc ? 'desc' : 'asc'
    } else {
      retval[columnIndex] = null
    }
  })

  return retval
})

function onClickHeader($event, column) {
  const foundOrder = inner.order.find((o) => o.value == column.value)
  if (!foundOrder) {
    if (!$event.ctrlKey) {
      inner.order = []
    }

    inner.order.push({
      value: column.value,
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

function emitUpdate() {
  emit('update:columns', inner.columns)
  return true
}


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

const isSettingsOpen = ref(false)

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
        <UiItem
          class="UiDataTable__toolbarItem UiDataTable__toolbarItem--settings"
          icon="mdi:cog"
          :title="i18n.t('UiDataTable.OpenSettings')"
          @click="isSettingsOpen = true"
        />

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
              v-for="(column) in visibleColumns"
              :key="column._i"
              :title="column.title"
              @dragover="onHeaderDragOver($event, column._i)"
              @drop="onHeaderDrop($event)"
            >
              <div
                :style="{pointerEvents: dropData.target == column ? 'none' : 'initial'}"
                class="UiDataTable__header"
                :class="{
                  'UiDataTable__header--ordered': columnOrder[column._i],
                  'UiDataTable__header--ordered-asc': columnOrder[column._i] == 'asc',
                  'UiDataTable__header--ordered-desc': columnOrder[column._i] == 'desc',

                  'UiDataTable__header--dropping': dropData.target == column._i,
                  'UiDataTable__header--dropping-before': dropData.target == column._i && dropData.position == 'before',
                  'UiDataTable__header--dropping-after': dropData.target == column._i && dropData.position == 'after',
                }"
                draggable="true"
                @dragstart="onHeaderDragStart($event, column._i)"
                @dragend="onHeaderDragEnd()"
              >
                <div
                  class="UiDataTable__header-title"
                  @click="onClickHeader($event, inner.columns[column._i])"
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
                        :column="inner.columns[column._i]"
                        :close="close"
                      />
                      <UiItem
                        icon="mdi:close"
                        :text="i18n.t('UiDataTable.HideColumn')"
                        @click="hideColumn(inner.columns[column._i]); close()"
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
              v-for="(column) in visibleColumns"
              :key="column._i"
              :style="{'--ui-table-title': `'${column.title}'`}"
            >
              <slot
                v-if="$slots[`type-${column.type}`]"
                :name="`type-${column.type}`"
                :value="columnValues[ri][column._i]"
                :column="column"
              />
              <UiOutput
                v-else
                class="UiDataTable__output"
                v-bind="column"
                :value="columnValues[ri][column._i]"
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

    <TempValue
      v-slot="{ tmp, accept, cancel }"
      v-model="inner.columns"
      @update:model-value="emitUpdate"
    >
      <UiDialog
        v-model:open="isSettingsOpen"
        @close="cancel"
      >
        <form
          method="dialog"
          class="UiDataTable__settings"
          @submit="accept"
        >
          <section>
            <ColumnManager
              v-if="isSettingsOpen"
              v-model="tmp.value"
            />
          </section>
          <footer>
            <UiInput
              type="submit"
              label="Accept"
            />
            <UiInput
              type="button"
              label="Cancel"
              class="UiButton--cancel"
              @click="isSettingsOpen = false"
            />
          </footer>
        </form>
      </UiDialog>
    </TempValue>
  </div>
</template>