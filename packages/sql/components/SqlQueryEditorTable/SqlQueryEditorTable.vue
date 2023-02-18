<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiDataTable, UiInput, UiIcon } from '@/packages/ui'
import { VmStatementDialog } from '@/packages/vm'

const i18n = useI18n({
  en: {
    'SqlQueryEditorTable.Filter': 'Filter',
    'SqlQueryEditorTable.SearchPlaceholder': 'Search',
  },
  es: {
    'SqlQueryEditorTable.Filter': 'Filtrar',
    'SqlQueryEditorTable.SearchPlaceholder': 'Buscar',
  },
  de: {
    'SqlQueryEditorTable.Filter': 'Filter',
    'SqlQueryEditorTable.SearchPlaceholder': 'Suche',
  },
})

const props = defineProps({
  /*
  A JSON SQL query object
  {
    "select": {
      "id": "person.id"
    },
    "from": {
      "table": "corp_people",
      "as": "person"
    },
    "join": [ ... ],
    "where": { ... },
    "order": [ ... ],
    "limit": ...
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  /*
  Array of field names to use for "main search"
  If present, a search input is displayed which injects the condition {search:{string:xxx, fields:xxxx}}
  to the query
  */
  searchFields: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const query = ref({})

watch(
  () => props.modelValue,
  (newValue) => query.value = newValue
    ? JSON.parse(JSON.stringify(newValue))
    : {},
  { immediate: true },
)

function emitUpdate() {
  const conditions = []

  // Conditional for main search
  if (searchString.value.trim() && props.searchFields) {
    conditions.push({
      search: {
        string: searchString.value.trim(),
        fields: props.searchFields,
      },
    })
  }

  // Conditionals from column filters
  conditions.push(...Object.values(filtersPerColumn.value).filter((f) => f != null))

  emit('update:modelValue', {
    ...query.value,
    where: conditions.length ? { and: conditions } : null,
  })
}

const searchString = ref('')
const filtersPerColumn = ref({})
const selectedColumn = ref()
</script>

<template>
  <div class="SqlQueryEditorTable">
    <VmStatementDialog
      v-if="selectedColumn"
      v-model="filtersPerColumn[selectedColumn.value]"
      :field="selectedColumn"
      @close="selectedColumn = null"
      @update:model-value="emitUpdate"
    />

    <UiDataTable
      v-model:order="query.order"
      v-bind="$attrs"
      @update:order="emitUpdate"
    >
      <template #toolbar>
        <UiInput
          v-if="props.searchFields"
          v-model="searchString"
          class="SqlQueryEditorTable__search"
          type="search"
          :placeholder="i18n.t('SqlQueryEditorTable.SearchPlaceholder')"
          debounce="600"
          @update:model-value="emitUpdate"
        />
        <slot name="toolbar" />
      </template>

      <template #column-icons="{ column }">
        <UiIcon
          v-if="column.filter"
          :title="i18n.t('SqlQueryEditorTable.Filter')"
          src="mdi:filter-variant"
          class="SqlQueryEditorTable__filterIcon UiDataTable__columnIcon"
          :class="{'SqlQueryEditorTable__filterIcon--filtered': filtersPerColumn[column.value]}"
          @click="selectedColumn = column"
        />
      </template>
    </UiDataTable>
  </div>
</template>

<style lang="scss">
//// SUPER MACHETE !!!!!!   visualmente ocultar los campos "field" y "op picker" de <StmtOp>
.SqlQueryEditorTable {
  .StmtOp {
    &__op,
    &__field,
    summary {
      display: none;
    }
  }
}

.SqlQueryEditorTable {
  &__search {
    flex: 1;
    input {
      width: 100%;
    }
  }

  &__filterIcon {
    position: relative;

    &--filtered {
      opacity: 1;
    }

    &--filtered::after {
      content: '';
      display: block;
      position: absolute;
      width: 8px;
      height: 8px;

      right: 4px;
      top: 50%;
      margin-top: -4px;

      background-color: #ea5455aa;
      border-radius: 50%;
      pointer-events: none;
    }
  }
}
</style>