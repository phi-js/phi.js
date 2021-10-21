<script setup>
import { ref, provide, computed, watch, watchEffect } from 'vue'
import { VM } from '/packages/vm'
import { UiStory, UiItem } from '/packages/ui/components'
import { CmsPage } from '../CmsPage'

const storyEl = ref({})

import customBlocks from './blocks'
import CMS from '../../singleton'
CMS.plugin({ blocks: customBlocks })

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

  activeNodeId: {
    type: [String, Number],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:activeNodeId'])

const currentNodeId = ref()

watch(
  () => props.activeNodeId,
  (newValue) => currentNodeId.value = newValue,
  { immediate: true },
)

const storyVm = new VM()
const parsedStory = ref({
  nodes: [],
  paths: [],
})

async function parseStory(story, modelValue) {
  var paths = []
  for (const curPath of story.paths) {
    let isVisible = curPath['v-if']
      ? await storyVm.eval(curPath['v-if'], modelValue)
      : true

    if (isVisible) {
      paths.push(curPath)
    }
  }

  const nodes = []
  for (const node of story.nodes) {
    let isVisible = node['v-if']
      ? await storyVm.eval(node['v-if'], modelValue)
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

  return {
    ...story,
    nodes,
    paths,
  }
}

let parserPromise = null
function getParsedStory() {
  if (parserPromise) {
    return parserPromise
  }

  parserPromise = new Promise((resolve) => parseStory(props.story, props.modelValue).then(resolve))
  return parserPromise
}

watchEffect(async () => {
  parserPromise = null
  parsedStory.value = await getParsedStory()

  if (!currentNodeId.value) {
    currentNodeId.value = parsedStory.value.nodes?.[0]?.id
    emit('update:activeNodeId', currentNodeId.value)
  }
})

async function fetchNode(nodeId) {
  // const story = await getParsedStory()
  // return story.nodes.find((n) => n.id == nodeId)
  return props.story.nodes.find((n) => n.id == nodeId)
}

function goTo(nodeId, target = null) {
  return storyEl.value.push(nodeId, target)
}

function back() {
  return storyEl.value.back()
}

// CMS plugins and settings
const vmFunctions = {
  'Story.goTo': ({ nodeId, target }) => goTo(nodeId, target),
  'Story.back': back,
}

// provide data for cms blocks
provide('$_cms_story', computed(() => ({
  currentNode: {
    ...parsedStory.value.nodes.find((n) => n.id == currentNodeId.value),
    exits: parsedStory.value.paths.filter((p) => p.from == currentNodeId.value),
  },
  goTo,
  back,
})))
</script>

<template>
  <UiStory
    ref="storyEl"
    v-model:active="currentNodeId"
    class="CmsStory"
    @update:active="emit('update:activeNodeId', $event)"
    @fetch="fetchNode"
  >
    <template #default="{ node, back: nodeBack }">
      <CmsPage
        class="CmsStory__page"
        :page="node?.page"
        :vm-functions="vmFunctions"
        :model-value="modelValue"
        @update:modelValue="emit('update:modelValue', $event)"
      >
        <template #header>
          <UiItem
            v-if="nodeBack"
            class="ui-clickable ui-noselect ui-item--inline"
            icon="mdi:arrow-left-thick"
            text="Regresar"
            @click="nodeBack()"
          />
        </template>
      </CmsPage>
    </template>
  </UiStory>
</template>
