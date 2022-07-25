<script setup>
import { computed } from 'vue'
import { availableFunctions } from '../../plugins/registerPlugin.js'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiDialog, UiItemFinder } from '@/packages/ui'

const emit = defineEmits(['input'])

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

const i18n = useI18n({
  en: {
    'VmExpressionPicker.label': 'Add action...',
    'VmExpressionPicker.Cancel': 'Cancel',
  },
  es: {
    'VmExpressionPicker.label': 'Agregar acción...',
    'VmExpressionPicker.Cancel': 'Cancelar',
  },
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

<style lang="scss">
.VmExpressionPicker {
  dialog {
    width: 500px;
    max-width: 95vw;

    min-height: 50vh;
    max-height: 80vh;

    .FinderItem {
      margin: 3px 0;
    }
  }
}
</style>