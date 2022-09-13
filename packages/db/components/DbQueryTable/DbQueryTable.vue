<script setup>
import { computed, ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiDataTable, UiItem, UiDialog, TempValue, UiInput } from '@/packages/ui'
import DbQueryWhere from '../DbQueryEditor/DbQueryWhere.vue'

const i18n = useI18n({
  en: {
    'DbQueryTable.Filters': 'Filters',
    'DbQueryTable.Accept': 'Accept',
    'DbQueryTable.Cancel': 'Cancel',
    'DbQueryTable.DownloadCsv': 'Download CSV',
    'DbQueryTable.AllSteps': 'All the steps',
  },

  es: {
    'DbQueryTable.Filters': 'Filtros',
    'DbQueryTable.Accept': 'Aceptar',
    'DbQueryTable.Cancel': 'Cancelar',
    'DbQueryTable.DownloadCsv': 'Descargar CSV',
    'DbQueryTable.AllSteps': 'Todos los pasos',
  },

  de: {
    'DbQueryTable.Filters': 'Filter',
    'DbQueryTable.Accept': 'Akzeptieren',
    'DbQueryTable.Cancel': 'Abbrechen',
    'DbQueryTable.DownloadCsv': 'CSV herunterladen',
    'DbQueryTable.AllSteps': 'Alle Schritte',
  },
})

const props = defineProps({
  query: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  columns: {
    type: Array,
    required: false,
    default: () => [],
  },

  records: {
    type: Array,
    required: false,
    default: () => [],
  },

  schema: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:query', 'update:columns', 'click-row'])

// query.  Inner copy of the query prop.
const query = ref({})
watch(
  () => props.query,
  (newValue) => {
    query.value = JSON.parse(JSON.stringify(newValue))
  },
  { immediate: true },
)

const nFilters = computed(() => query.value.where?.and?.length || query.value.where?.or?.length || 0)

// The "where" property of the query.
const isFiltersOpen = ref(false)
const whereField = ref()

function openColumnFilters(column) {
  whereField.value = column.field || column.value.replace('$.', '')
  isFiltersOpen.value = true
}

const editableWhere = computed({
  get() {
    if (whereField.value) {
      const conditionArr = query.value.where?.and || query.value.where?.or || []
      const foundFilter = conditionArr.find((cond) => cond.field == whereField.value)
      if (!foundFilter) {
        return {
          field: whereField.value,
          op: null,
          args: null,
        }
      }
      return foundFilter
    }

    return query.value.where || { and: [] }
  },

  set(newValue) {
    if (whereField.value) {
      const conditionArr = query.value.where?.and || query.value.where?.or
      if (!conditionArr) {
        query.value.where = { and: [{ ...newValue }] }
        emitUpdateQuery()
        return
      }

      const foundFilter = conditionArr.find((cond) => cond.field == whereField.value)
      if (foundFilter) {
        Object.assign(foundFilter, newValue)
      } else {
        conditionArr.push(newValue)
      }

    } else {
      query.value.where = newValue
    }

    emitUpdateQuery()
  },
})

function emitUpdateQuery() {
  emit('update:query', { ...query.value })
}

</script>

<template>
  <div class="DbQueryTable">
    <!-- Main table -->
    <UiDataTable
      v-model:order="query.order"
      class="DbQueryTable__table"
      :records="props.records"
      :columns="props.columns"
      @update:order="emitUpdateQuery"
      @update:columns="emit('update:columns', $event)"
      @click-record="emit('click-row', $event)"
    >
      <template #toolbar>
        <slot name="toolbar" />

        <UiItem
          class="UiDataTable__toolbarItem"
          icon="mdi:filter-variant"
          :text="(nFilters ? nFilters+' ' : '') + i18n.t('DbQueryTable.Filters')"
          @click="isFiltersOpen = true"
        />
      </template>

      <!-- Column specific filters -->
      <template #column-popup="{ column, close }">
        <UiItem
          :text="i18n.t('DbQueryTable.Filters')"
          icon="mdi:filter-variant"
          @click="openColumnFilters(column); close()"
        />
      </template>
    </UiDataTable>

    <!-- Filters dialog -->
    <UiDialog
      v-slot="{ close }"
      v-model:open="isFiltersOpen"
      class="DbQueryTable__filterDialog"
      @close="whereField = null"
    >
      <TempValue
        v-slot="{ tmp, accept, cancel}"
        v-model="editableWhere"
      >
        <form
          class="DbQueryTable__filterForm"
          method="dialog"
          @submit="accept()"
        >
          <DbQueryWhere
            v-model="tmp.value"
            :schema="props.schema"
          />
          <footer>
            <UiInput
              type="submit"
              :label="i18n.t('DbQueryTable.Accept')"
            />
            <UiInput
              type="button"
              :label="i18n.t('DbQueryTable.Cancel')"
              class="UiButton--cancel"
              @click="cancel(); close();"
            />
          </footer>
        </form>
      </TempValue>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.DbQueryTable {
  &__filterForm {
    padding: 8px;

    footer {
      display: flex;
      flex-wrap: nowrap;
      gap: 8px;
    }
  }
}
</style>