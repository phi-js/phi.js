<script setup>
import { computed, inject } from 'vue'
import { UiDialog, UiItemFinder, UiCodeLine } from '@/packages/ui'
import getDefinedStatements from './getDefinedStatements.js'
import useVmI18n from '../../i18n'

const props = defineProps({
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
    subtext: fieldSchema.subtext,
    icon: fieldSchema.icon,
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

  emit('input', {
    ...$event.stmt,
    info: {
      text: $event.title || '',
      icon: $event.icon || '',
    },
  })
}
</script>

<template>
  <UiDialog class="VmStatementPicker">
    <template #trigger>
      <UiCodeLine v-bind="$attrs" />
    </template>
    <template #default="{ close }">
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
  .UiCodeLine {
    cursor: pointer;

    &__text,
    &__icon {
      opacity: 0.5;
    }

    &:hover .UiCodeLine {
      &__text,
      &__icon {
        opacity: 1;
      }
    }
  }
}
</style>