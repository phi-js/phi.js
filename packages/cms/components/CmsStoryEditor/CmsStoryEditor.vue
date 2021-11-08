<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiStory, UiItem, UiInput, UiIcon } from '/packages/ui/components'
import { CmsPageEditor } from '../CmsPageEditor'
import { useHistory } from '/packages/ui/helpers'

const storyEl = ref()

import customBlocks from '../CmsStory/blocks'
import CMS from '../../singleton'
CMS.plugin({ blocks: customBlocks })

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: null,
  },

  settings: {
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

const emit = defineEmits(['update:story', 'update:activeNodeId'])

const story = ref()
const currentNodeId = ref()

const { hasUndo, hasRedo, undo, redo } = useHistory(story, (storedValue) => {
  story.value = storedValue
  emitUpdate()
})

watch(
  () => props.story,
  (newValue) => {
    // story.value = newValue ? JSON.parse(JSON.stringify(newValue)) : {}
    story.value = newValue ? newValue : {}
    if (!currentNodeId.value) {
      currentNodeId.value = story.value.nodes?.[0]?.id
      emit('update:activeNodeId', currentNodeId.value)
    }
  },
  { immediate: true },
)

watch(
  () => props.activeNodeId,
  (newValue) => currentNodeId.value = newValue,
  { immediate: true },
)

function emitUpdate() {
  emit('update:story', story.value)
}

function fetchNode(nodeId) {
  return story.value.nodes.find((node) => node.id == nodeId)
}

function updatePage(node, newPage) {
  const index = story.value.nodes.findIndex((n) => node.id == n.id)
  if (index === -1) {
    return
  }
  story.value.nodes[index].page = newPage
  emitUpdate()
}

async function createNode(nodeId, fromId = null) {
  if (!story.value.nodes.find((n) => n.id == nodeId)) {
    story.value.nodes.push({
      id: nodeId,
      card: { text: `Pagina ${nodeId}` },
      page: { blocks: [] },
    })
  }

  if (fromId) {
    story.value.paths.push({
      from: fromId,
      to: nodeId,
      card: { text: 'Continuar a....' },
    })
  }

  emitUpdate()
}

const availableNodes = computed(() =>
  story.value?.nodes?.length
    ? story.value.nodes.map((node) => ({
      text: node?.card?.text,
      value: node.id,
    }))
    : [])


// provide data for cms blocks
provide('$_cms_story', computed(() => ({
  currentNode: {
    ...story.value.nodes.find((n) => n.id == currentNodeId.value),
    exits: story.value.paths.filter((p) => p.from == currentNodeId.value),
  },
  goTo: storyEl.value.push,
  back: storyEl.value.back,
  createNode,
})))
</script>

<template>
  <div>
    <!-- <div>
      <UiIcon
        class="ui--clickable ui--padded"
        :class="{'ui-disabled': !hasUndo}"
        title="Deshacer"
        src="mdi:undo"
        @click="undo()"
      />
      <UiIcon
        class="ui--clickable ui--padded"
        :class="{'ui-disabled': !hasRedo}"
        title="Rehacer"
        src="mdi:redo"
        @click="redo()"
      />
    </div> -->

    <UiStory
      ref="storyEl"
      v-model:active="currentNodeId"
      class="CmsStoryEditor"
      @fetch="fetchNode"
      @update:active="emit('update:activeNodeId', $event)"
    >
      <template #default="{ node, back }">
        <CmsPageEditor
          :page="node.page"
          :settings="settings"
          @update:page="updatePage(node, $event)"
        >
          <template #toolbar>
            <UiInput
              v-model="currentNodeId"
              type="select-native"
              :options="availableNodes"
            />
          </template>

          <template #header>
            <UiItem
              v-show="back"
              class="ui--clickable ui--noselect ui-item--inline"
              icon="mdi:arrow-left-thick"
              text="Regresar"
              @click="back()"
            />
          </template>
        </CmsPageEditor>
      </template>
    </UiStory>
  </div>
</template>