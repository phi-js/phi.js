<script setup>
import { ref, watchEffect } from 'vue'
import { UiGraphGrid, UiItem, UiIcon } from '@/packages/ui/components'
import GraphNodeItem from './GraphNodeItem.vue'
import GraphNodeCreator from './GraphNodeCreator.vue'

const props = defineProps({
  story: {
    type: Object,
    required: true,
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:currentPageId', 'createPage', 'createPath', 'updatePage', 'deletePage'])

const graph = ref({
  nodes: [],
  paths: [],
})

const targetPickerParent = ref()

/*
Graph nodes are page objects, with only the properties:
{
  id: ...,
  hash: ...,
  info: {
    text: ...
  }
}
*/
watchEffect(
  () => {
    graph.value.nodes = props.story?.pages?.length
      ? props.story.pages.map((p, index) => ({
        id: p.id || index,
        hash: p.hash || p.id || index,
        info: {
          text: p.info?.text || p.hash || p.id || `Page ${index}`
        }
      }))
      : []
    graph.value.paths = props.story?.paths?.length ? [...props.story.paths] : []

    // Create a "root" node, with paths to all root level nodes
    const rootNodes = graph.value.nodes.filter(node => !graph.value.paths.find(path => path.to == node.id))
    graph.value.nodes.push({ "id": "--root--" })
    rootNodes.forEach(node => graph.value.paths.push({
      from: '--root--',
      to: node.id
    }))

    if (targetPickerParent.value) {
      return
    }

    // Add a "Create new page" after every end node
    const endNodes = graph.value.nodes.filter(node => !graph.value.paths.find(path => path.from == node.id))
    endNodes.forEach(node => {
      graph.value.nodes.push({
        id: `--creator--${node.id}`,
        isCreator: true,
        parentId: node.id
      })

      graph.value.paths.push({
        from: node.id,
        to: `--creator--${node.id}`
      })
    })

    // Add a "Create new page" after root node
    graph.value.nodes.push({
      id: '--creator--root',
      isCreator: true,
      parentId: null
    })

    graph.value.paths.push({
      from: '--root--',
      to: '--creator--root'
    })
  }
)

function onClickNode(nodeId) {
  emit('update:currentPageId', nodeId)
}

function onCreateNode(nodeData) {
  emit('createPage', nodeData)
}

function onUpdateNode(nodeData) {
  emit('updatePage', nodeData)
}

function onDeleteNode(nodeId) {
  emit('deletePage', nodeId)
}


// Target picker mode
function startTargetPicker(parentId) {
  targetPickerParent.value = parentId
  document.addEventListener('keydown', escapeListener)
}

function clickPathTarget(targetId) {
  if (!targetPickerParent.value || targetPickerParent.value == targetId) {
    return
  }
  const newPath = { from: targetPickerParent.value, to: targetId }
  cancelTargetPicker()
  emit('createPath', newPath)
}

function cancelTargetPicker() {
  targetPickerParent.value = null
  document.removeEventListener('keydown', escapeListener)
}

function escapeListener(event) {
  if (event?.key === 'Escape') {
    cancelTargetPicker()
  }
}
</script>

<template>
  <UiGraphGrid class="CmsStoryGraph" :graph="graph">
    <template #node="{ node }">
      <div v-if="node.id == '--root--'" class="CmsStoryGraph__dot"></div>
      <template v-else-if="!!targetPickerParent">
        <UiItem
          v-if="targetPickerParent == node.id"
          icon="mdi:close"
          :text="`From ${node.info.text} ...`"
          @click="cancelTargetPicker"
          class="CmsStoryGraph__item-from"
        >
          <template #actions>
            <UiIcon src="mdi:arrow-right-thick" />
          </template>
        </UiItem>
        <UiItem
          v-else
          :text="`to ${node.info.text}`"
          icon="mdi:arrow-right-thick"
          @click="clickPathTarget(node.id)"
          class="CmsStoryGraph__item-to"
        />
      </template>
      <template v-else>
        <GraphNodeCreator
          v-if="node.isCreator"
          @create="onCreateNode({ ...$event, parentId: node.parentId || null })"
        />
        <GraphNodeItem
          v-else
          :active="currentPageId == node.id"
          :node="node"
          @update:node="onUpdateNode"
          @click="onClickNode(node.id)"
          @start-path="startTargetPicker(node.id)"
          @delete="onDeleteNode(node.id)"
        />
      </template>
    </template>
  </UiGraphGrid>
</template>

<style lang="scss">
.CmsStoryGraph {
  // Fine-tuning node position inside UiGraphGrid (which has an expected node height of 50px)
  .grid-item > * {
    position: relative;
    top: 7px;
  }

  &__dot {
    margin: auto;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--ui-color-primary);

    position: relative;
    top: 12px !important;
  }

  // Target picker mode
  &__item-from,
  &__item-to {
    cursor: pointer;
    border-radius: var(--ui-radius);
    font-size: 14px;
    font-weight: bold;
    background-color: #f4f4f4;
    white-space: nowrap;
    max-width: 200px;
  }

  &__item-from {
    background-color: var(--ui-color-primary);
    color: #fff;

    &:hover {
      background-color: #ffbbaa;
    }
  }

  &__item-to {
    border: 2px dashed var(--ui-color-primary);
    color: #666;

    &:hover {
      background-color: #ffffaa;
    }
  }
}
</style>