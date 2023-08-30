<script setup>
import { computed, ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'

import UiInput from '../UiInput/UiInput.vue'
import UiIcon from '../UiIcon/UiIcon.vue'
import UiFolderGrid from './UiFolderGrid.vue'
import UiFolderTable from './UiFolderTable.vue'

const i18n = useI18n({
  en: {
    'UiFolder.Grid': 'Grid',
    'UiFolder.Table': 'Table',
    'UiFolder.Name': 'Name',
    'UiFolder.dateModified': 'Last changed',
  },
  es: {
    'UiFolder.Grid': 'Cuadrícula',
    'UiFolder.Table': 'Tabla',
    'UiFolder.Name': 'Nombre',
    'UiFolder.dateModified': 'Ultima modificación',
  },
})

const props = defineProps({
  /*
  Array of items to be displayed.
  ITEMS have the format:
  {
    "path": "/...",  always starts with /
    "type": "",
    "data": {
      // any data.
      ... whatever

      // By default, UiItem properties are assumed to be present
      "text": "",
      "subtext": "",
      "icon": "",
    }
  }
  */
  items: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  [
    {
      text: 'Suggestions',
      match: {
        type: 'suggestion'
        PROP NAME:  PROP VALUE  // se determina que un item pertenece a un section si item[prop name] == section.match[prop name]
      },
    },
    {
      text: 'Folders',
      match: { type: 'folder' },
    },
    {
      text: 'Interfaces',
      match: { type: 'interface' },
    },
  ]
  */
  sections: {
    type: Array,
    required: false,
    default: () => [],
  },

  view: {
    type: String,
    required: false,
    default: 'table', // 'grid' | 'table'
  },
})

const currentView = ref(localStorage.getItem('UiFolder.view') || props.view)
watch(currentView, (val) => localStorage.setItem('UiFolder.view', val))

const sortColumn = ref(localStorage.getItem('UiFolder.sortColumn') || 'dateModified')
watch(sortColumn, (val) => localStorage.setItem('UiFolder.sortColumn', val))

const sortDesc = ref((localStorage.getItem('UiFolder.sortDesc') || 'desc') == 'desc')
watch(sortDesc, (val) => localStorage.setItem('UiFolder.sortDesc', val ? 'desc' : 'asc'))

const availableColumns = computed(() => [
  { value: 'text', text: i18n.t('UiFolder.Name') },
  { value: 'dateModified', text: i18n.t('UiFolder.dateModified') },
])

const computedSections = computed(() => {
  if (!props.sections.length) {
    return [{ items: props.items }]
  }

  return props.sections.map((section) => {
    return {
      ...section,
      items: props.items.filter((item) => {
        for (const [key, value] of Object.entries(section.match)) {
          if (item[key] == value) {
            return true
          }
        }
        return false
      }),
    }
  })
})

const sortedSections = computed(() => {
  return computedSections.value.map((section) => {
    const items = section.items.concat()

    if (sortColumn.value) {
      items.sort((a, b) => {
        let retval = 0

        if (!a.data || !b.data) {
          return 0
        }

        if (sortColumn.value == 'text') {
          retval = a.data[sortColumn.value].localeCompare(b.data[sortColumn.value])
        } else {
          retval = a.data[sortColumn.value] - b.data[sortColumn.value]
        }
        return sortDesc.value ? retval * -1 : retval
      })
    }

    return {
      ...section,
      items,
    }
  })
})
</script>

<template>
  <div
    class="UiFolder"
    :class="`UiFolder--${currentView}`"
  >
    <div class="UiFolder__header">
      <slot name="header" />

      <UiInput
        v-model="currentView"
        class="UiFolder__viewPicker"
        type="select-buttons"
        :options="[
          { value: 'grid', text: i18n.t('UiFolder.Grid'), icon: 'mdi:view-grid' },
          { value: 'table', text: i18n.t('UiFolder.Table'), icon: 'mdi:view-list' },
        ]"
      />

      <div class="UiFolder__sorter">
        <UiInput
          v-model="sortColumn"
          type="select-native"
          :options="availableColumns"
        />
        <UiIcon
          :src="sortDesc ? 'mdi:arrow-down-thick' : 'mdi:arrow-up-thick'"
          @click="sortDesc = !sortDesc"
        />
      </div>
    </div>

    <div class="UiFolder__body">
      <UiFolderGrid
        v-if="currentView == 'grid'"
        :sections="sortedSections"
      >
        <template #actions="slotBindings">
          <slot
            name="actions"
            v-bind="slotBindings"
          />
        </template>
      </UiFolderGrid>
      <UiFolderTable
        v-else
        :sections="sortedSections"
      >
        <template #actions="slotBindings">
          <slot
            name="actions"
            v-bind="slotBindings"
          />
        </template>
      </UiFolderTable>
    </div>
  </div>
</template>

<style lang="scss">
@media only screen and (max-width: 500px) {
  .UiFolder__viewPicker {
    display: none;
  }
}

.UiFolder {
  &__header {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
  }

  &__viewPicker {
    .UiItem__body {
      display: none;
    }
  }

  &__sorter {
    display: inline-flex;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 8px;

    .UiInput {
      font-size: 0.9rem;
    }

    .UiIcon {
      width: 40px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }
}

.UiFolderGrid,
.UiFolderTable {
  &__sectionLabel {
    user-select: none;
    display: block;
    padding: 8px 2px;

    font-weight: bold;
    font-size: 0.9rem;
  }
}

.UiFolderTable {
  .UiDialog__trigger {
    display: inline-block;
  }
}
</style>