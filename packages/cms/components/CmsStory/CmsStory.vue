<script setup>
import { ref, provide, computed, watchEffect } from 'vue'
import { VM } from '/packages/vm'
import { UiStory } from '/packages/ui/components/UiStory'
import { UiItem } from '/packages/ui/components/UiItem'
import { CmsPage } from '../CmsPage'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

const refStory = ref({})

const navFunctions = {
  goTo: (nodeId) => refStory.value.goTo(nodeId),
  goBack: () => refStory.value.goBack(),
}

const storyVm = new VM()
const parsedStory = ref({})
watchEffect(async () => {
  var paths = []
  for (const curPath of props.story.paths) {
    let isVisible = curPath['v-if']
      ? await storyVm.eval(curPath['v-if'], props.modelValue)
      : true

    if (isVisible) {
      paths.push(curPath)
    }
  }

  const nodes = []
  for (const node of props.story.nodes) {
    let isVisible = node['v-if']
      ? await storyVm.eval(node['v-if'], props.modelValue)
      : true

    if (isVisible) {
      nodes.push(node)
    } else {
      // Bridge paths around node

      // Obtain all incoming and outgoing paths
      let incomingPaths = paths.filter((p) => p.to == node.id)
      let outgoingPaths = paths.filter((p) => p.from == node.id)

      // Delete those paths (all connected to this node)
      paths = paths.filter((p) => p.from != node.id && p.to != node.id)

      // Create a bridge between each incoming and outgoing path
      incomingPaths.forEach((incoming) => {
        outgoingPaths.forEach((outgoing) => {
          paths.push(Object.assign({}, outgoing, {
            from: incoming.from,
            to: outgoing.to,
          }))
        })
      })
    }
  }

  parsedStory.value = {
    nodes,
    paths,
  }
})

// CMS plugins and settings
const vmFunctions = {
  'CmsStory.goTo': navFunctions.goTo,
  'CmsStory.goBack': navFunctions.goBack,
}

import customBlocks from './blocks'
import CMS from '../../singleton'
CMS.plugin({ blocks: customBlocks })

// provide data for cms blocks
provide('$_cms_story', computed(() => ({
  ...navFunctions,
  currentNode: refStory.value?.currentNode,
  history: refStory.value?.history,
  nodes: parsedStory.value.nodes,
  paths: parsedStory.value.paths,
})))
</script>

<template>
  <UiStory
    ref="refStory"
    class="CmsStory"
    :model-value="parsedStory"
  >
    <template #contents="{ node }">
      <UiItem
        v-show="refStory?.hasBack"
        class="ui-clickable ui-noselect ui-item--inline"
        icon="mdi:arrow-left-thick"
        text="Regresar"
        @click="refStory.goBack()"
      />

      <CmsPage
        class="CmsStory__page"
        :page="node?.page"
        :vm-functions="vmFunctions"
        :model-value="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
      />
    </template>
  </UiStory>
</template>
