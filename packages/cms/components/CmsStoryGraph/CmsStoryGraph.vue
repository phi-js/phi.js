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

const emit = defineEmits([
  'update:story',
  'update:currentPageId',
  'createPage',
  'createPath',
  'updatePage',
  'deletePage',
])

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
watchEffect(() => {
  graph.value.nodes = props.story?.pages?.length
    ? props.story.pages.map((p, index) => ({
      id: p.id || index,
      hash: p.hash || p.id || index,
      info: { text: p.info?.text || p.hash || p.id || `Page ${index}` },
    }))
    : []
  graph.value.paths = props.story?.paths?.length ? [...props.story.paths] : []

  // // Create a "root" node, with paths to all root level nodes
  // const rootNodes = graph.value.nodes.filter((node) => !graph.value.paths.find((path) => path.to == node.id))
  // graph.value.nodes.push({ id: '--root--' })
  // rootNodes.forEach((node) => graph.value.paths.push({
  //   from: '--root--',
  //   to: node.id,
  // }))

  if (targetPickerParent.value) {
    return
  }

  // Add a "Create new page" after every end node
  const endNodes = graph.value.nodes.filter((node) => !graph.value.paths.find((path) => path.from == node.id))
  endNodes.forEach((node) => {
    graph.value.nodes.push({
      id: `--creator--${node.id}`,
      isCreator: true,
      parentId: node.id,
    })

    graph.value.paths.push({
      from: node.id,
      to: `--creator--${node.id}`,
    })
  })

  // // Add a "Create new page" after root node
  // graph.value.nodes.push({
  //   id: '--creator--root',
  //   isCreator: true,
  //   parentId: null,
  // })

  // graph.value.paths.push({
  //   from: '--root--',
  //   to: '--creator--root',
  // })
})

function onClickNode(nodeId) {
  emit('update:currentPageId', nodeId)
}

function onCreateNode(nodeData) {
  emit('createPage', nodeData)

  const newPage = {
    id: nodeData.hash,
    hash: nodeData.hash,
    info: { text: nodeData.info.text },

    // default page contents
    component: 'LayoutPage',
    slot: [],
  }

  const story = { ...props.story }
  story.pages.push(newPage)
  if (nodeData.parentId) {
    story.paths.push({ from: nodeData.parentId, to: newPage.id })
  }

  emit('update:story', story)
}

function onUpdateNode(nodeData) {
  emit('updatePage', nodeData)

  const foundPage = props.story.pages.find((p) => p.id === nodeData.id)
  if (!foundPage) {
    return
  }

  foundPage.hash = nodeData.hash // This is modifying prop "story" (!)
  foundPage.info.text = nodeData.info.text
  emit('update:story', props.story)
}

function onDeleteNode(nodeId) {
  emit('deletePage', nodeId)

  const storyClone = { ...props.story }
  const foundPageIndex = storyClone.pages.findIndex((p) => p.id === nodeId)
  if (foundPageIndex !== -1) {
    storyClone.pages.splice(foundPageIndex, 1)
    storyClone.paths = storyClone.paths.filter((p) => p.from != nodeId && p.to != nodeId)
    emit('update:story', storyClone)
  }
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

  emit('update:story', {
    ...props.story,
    paths: props.story.paths.concat([newPath]),
  })
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
  <UiGraphGrid
    class="CmsStoryGraph"
    :graph="graph"
  >
    <template #node="{ node }">
      <div
        v-if="node.id == '--root--'"
        class="CmsStoryGraph__dot"
      />
      <template v-else-if="!!targetPickerParent">
        <UiItem
          v-if="targetPickerParent == node.id"
          icon="mdi:close"
          :text="`From ${node.info.text} ...`"
          class="CmsStoryGraph__item-from"
          @click="cancelTargetPicker"
        >
          <template #actions>
            <UiIcon src="mdi:arrow-right-thick" />
          </template>
        </UiItem>
        <UiItem
          v-else
          :text="`to ${node.info.text}`"
          icon="mdi:arrow-right-thick"
          class="CmsStoryGraph__item-to"
          @click="clickPathTarget(node.id)"
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