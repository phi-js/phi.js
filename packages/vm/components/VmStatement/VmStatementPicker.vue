<script setup>
import { computed, inject } from 'vue'
import { UiItem, UiDialog, UiItemFinder } from '@/packages/ui'
import getDefinedStatements from './getDefinedStatements.js'
import useVmI18n from '../../i18n'



const props = defineProps({
  label: {
    type: String,
    required: false,
    default: 'Add statement',
  },

  type: {
    type: String,
    required: false,
    default: null, // 'operator' || null
  },
})

const emit = defineEmits(['input'])
const i18n = useVmI18n()
const injectedFields = inject('$_vm_fields', null)

function fieldSchemaToStatementItem(fieldSchema) {
  if (!fieldSchema) {
    return null
  }

  if (fieldSchema?.children?.length) {
    return {
      ...fieldSchema,
      children: fieldSchema.children.map((item) => fieldSchemaToStatementItem(item)),
    }
  }

  return {
    text: fieldSchema.text || fieldSchema.value,
    stmt: {
      field: fieldSchema.value,
      op: null,
      args: '',
    },
  }
}

const fieldStatements = computed(() => {
  const fieldOperators = injectedFields?.value?.length
    ? injectedFields.value.map(fieldSchemaToStatementItem)
    : []

  return [
    ...fieldOperators,
    {
      text: i18n.t('VmOperatorPicker.Other'),
      stmt: 'customField',
    },
    {
      text: i18n.t('VmOperatorPicker.allOf'),
      stmt: { and: [] },
    },
    {
      text: i18n.t('VmOperatorPicker.anyOf'),
      stmt: { or: [] },
    },
  ]
})

const definedStatements = getDefinedStatements()
const availableStatements = computed(() => props.type == 'operator' ? fieldStatements.value : definedStatements.value)

function onSelectItem($event) {
  if ($event.stmt == 'customField') {
    let fieldName = prompt(i18n.t('StmtChainItem.variableName'))
    if (!fieldName) {
      return
    }

    $event.stmt = {
      field: fieldName,
      op: null,
      args: null,
    }
  }

  emit('input', $event.stmt)
}
</script>

<template>
  <UiDialog
    class="VmStatementPicker"
    show-close-button
  >
    <template #trigger>
      <UiItem
        class="VmStatementPicker__item"
        icon="mdi:plus"
        :text="props.label"
      />
    </template>
    <template #contents="{ close }">
      <UiItemFinder
        class="VmStatementPicker__contents"
        :items="availableStatements"
        @select-item="onSelectItem($event); close();"
      />
    </template>
  </UiDialog>
</template>

<style lang="scss">
.VmStatementPicker {
  &__item {
    --ui-item-padding: 6px;
    border: 2px dashed #ccc;
    border-radius: 4px;

    user-select: none;
    cursor: pointer;
  }
}
</style>