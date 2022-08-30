<script setup>
import { computed, inject } from 'vue'

import { UiItem, UiDialog, UiItemFinder } from '@/packages/ui'
import { availableFunctions } from '../../plugins/registerPlugin.js'
import useVmI18n from '../../i18n'
const i18n = useVmI18n()

const emit = defineEmits(['input'])

const injectedFunctions = inject('$_vm_functions', {})

function onSelectItem($event) {
  const emitValue = {
    definition: $event,
    expression: null,
  }

  if ($event.expression) {
    emitValue.expression = $event.expression
  } else if ($event.name) {
    emitValue.expression = {
      call: $event.name,
      args: null,
    }
  }

  if (emitValue.expression) {
    emit('input', emitValue)
  }
}

const items = computed(() => {
  return [
    ...injectedFunctions.value,

    {
      title: 'Code',
      children: [
        {
          icon: 'mdi:language-javascript',
          title: 'JavaScript',
          expression: { eval: '' },
        },

        {
          icon: 'mdi:directions-fork',
          title: 'IF',
          expression: {
            if: { and: [] },
            then: { do: null },
            else: { do: null },
          },
        },
      ],
    },
    ...availableFunctions,
  ]
})
</script>

<template>
  <UiDialog class="VmExpressionPicker">
    <template #trigger="{ isOpen }">
      <UiItem
        class="VmExpressionPicker__item"
        :icon="isOpen ? 'mdi:close': 'mdi:plus'"
        :text="isOpen ? i18n.t('VmExpressionPicker.Cancel') : i18n.t('VmExpressionPicker.label')"
      />
    </template>
    <template #contents="{ close }">
      <UiItemFinder
        class="VmExpressionPicker__contents"
        :items="items"
        @select-item="onSelectItem($event); close();"
      />
    </template>
  </UiDialog>
</template>