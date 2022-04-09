<script setup>
import { computed } from 'vue'
import { plugins } from '../../plugins/registerPlugin.js'
import { UiItem, UiDrawer, UiItemFinder } from '../../../ui'

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

</script>

<template>
  <UiDrawer class="VmExpressionPicker">
    <template #trigger>
      <UiItem
        class="ui--clickable"
        icon="mdi:plus-circle"
        subtext="Agregar ..."
      />
    </template>
    <template #contents="{ close }">
      <UiItemFinder
        :items="items"
        @select-item="$event.onLaunch(); close();"
      />
    </template>
  </UiDrawer>
</template>