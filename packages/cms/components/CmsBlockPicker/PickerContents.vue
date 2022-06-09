<script setup>
import { ref } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItemFinder } from '@/packages/ui'
import { getPluginData } from '../../functions'

import dictionary from './PickerContents.i18n.js'
const i18n = useI18n(dictionary)

const emit = defineEmits(['input'])

const pluginData = getPluginData()
const objAllBlocks = pluginData?.blocks || {}

// Raw array of all available blocks
// (All those without disabled:true in their definition i.e. LayoutPage)
const allBlocks = ref([])
for (const [blockName, blockDefinition] of Object.entries(objAllBlocks)) {
  if (blockDefinition?.disabled) {
    continue
  }

  allBlocks.value.push({
    ...blockDefinition,
    id: blockName,
    name: blockName,
    text: blockDefinition.title || blockName,
    // rename block "tags" to "tabs"
    tabs: (blockDefinition.tags || ['default']).map((tagName) => i18n.t(`PickerContents.Tab.${tagName}`)),
  })
}


function launchBlock(blockDefinition) {
  if (!blockDefinition?.block) {
    console.warn('Cannot launch block from object:', blockDefinition)
    return
  }

  const jsonBlock = JSON.parse(JSON.stringify({
    ...blockDefinition.block,
    component: blockDefinition.name,
  }))
  emit('input', jsonBlock)
}

</script>

<template>
  <UiItemFinder
    class="PickerContents"
    :items="allBlocks"
    @select-item="launchBlock"
  />
</template>