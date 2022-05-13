<script setup>
import { computed } from 'vue'
import { plugins } from '../../plugins/registerPlugin.js'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiDrawer, UiItemFinder } from '@/packages/ui'

const emit = defineEmits(['input'])

const items = computed(() => {
  const allFunctions = {}
  plugins.forEach((plugin) => {
    for (let fnName in plugin.functions) {
      allFunctions[fnName] = plugin.functions[fnName]
      allFunctions[fnName].name = fnName
    }
  })

  const fns = Object.values(allFunctions).map((fn) => ({
    id: fn.name,
    icon: fn.icon,
    text: fn.text,
    tabs: Array.isArray(fn.tabs) ? fn.tabs : ['Functions'],

    onLaunch: () => {
      let expression = {
        call: fn.name,
        args: null,
      }
      emit('input', { expression, definition: fn })
    },
  }))

  const code = [
    {
      tabs: ['code'],
      icon: 'mdi:language-javascript',
      text: 'JavaScript',
      onLaunch: () => {
        emit('input', {
          expression: { eval: '' },
          definition: {
            icon: 'mdi:language-javascript',
            text: 'JavaScript',
          },
        })
      },
    },

    {
      tabs: ['code'],
      icon: 'mdi:directions-fork',
      text: 'IF',
      onLaunch: () => {
        let expression = {
          if: { and: [] },
          then: { do: null },
          else: { do: null },
        }

        emit('input', {
          expression,
          definition: {
            icon: 'mdi:directions-fork',
            text: 'IF',
          },
        })
      },
    },
  ]

  return [...fns, ...code]
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
  <UiDrawer class="VmExpressionPicker">
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
        @select-item="$event.onLaunch(); close();"
      />
    </template>
  </UiDrawer>
</template>