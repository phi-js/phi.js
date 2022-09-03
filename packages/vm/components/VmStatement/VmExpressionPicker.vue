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

function translateItem(fxItem) {
  if (Array.isArray(fxItem)) {
    return fxItem.map(translateItem)
  }

  return ({
    ...fxItem,
    title: i18n.t(`VmExpression.${fxItem.name}.title`, null, fxItem.title || fxItem.name),
    description: i18n.t(`VmExpression.${fxItem.name}.description`, null, fxItem.description || ''),
    children: Array.isArray(fxItem.children) ? translateItem(fxItem.children) : undefined,
  })
}

const items = computed(() => translateItem([
  ...injectedFunctions.value,
  ...availableFunctions,
]))
</script>

<template>
  <UiDialog
    class="VmExpressionPicker"
    show-close-button
  >
    <template #trigger>
      <UiItem
        class="VmExpressionPicker__item"
        icon="mdi:plus"
        :text="i18n.t('VmExpressionPicker.label')"
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