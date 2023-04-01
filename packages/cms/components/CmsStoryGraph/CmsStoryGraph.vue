<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput, UiIcon, UiGraphStack, UiDialog, UiItem, UiDetails } from '@/packages/ui'
import { VmStatement } from '@/packages/vm'

const i18n = useI18n({
  en: {
    'CmsStoryGraph.CreatePathTo': 'Create path to ...',
    'CmsStoryGraph.CreatePage': 'Create page',
  },
  es: {
    'CmsStoryGraph.CreatePathTo': 'Crear ruta a ...',
    'CmsStoryGraph.CreatePage': 'Crear página',
  },
})

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

const emit = defineEmits(['update:story', 'update:currentPageId'])

const graph = ref()
const currentPageId = ref()

function getGraph(story) {
  const nodes = story.pages.map((p) => ({
    'id': p.id,
    'text': p.title || p.id,
    'v-if': p['v-if'],
  }))

  const paths = Array.isArray(story.paths)
    ? story.paths
    : []

  return {
    nodes,
    paths,
  }
}

watch(
  () => props.story,
  (newValue) => graph.value = getGraph(newValue),
  { immediate: true },
)

watch(
  () => props.currentPageId,
  (newValue) => currentPageId.value = newValue,
  { immediate: true },
)


const currentNode = computed(() => graph.value.nodes.find((n) => n.id == currentPageId.value))

function emitUpdate() {
  // Sort pages according to node order
  const pages = []
  graph.value.nodes.forEach((node) => {
    const foundPage = props.story.pages.find((p) => p.id == node.id)
    pages.push({
      ...foundPage,
      'v-if': node['v-if'],
    })
  })

  emit('update:story', {
    ...props.story,
    pages,
    paths: graph.value.paths,
  })
}

const toPageId = ref()

function createPath(toPageId) {
  // Do not create paths to self
  if (!toPageId || toPageId == currentPageId.value) {
    return
  }

  const fromPageId = currentPageId.value
  const existing = graph.value.paths.find((p) => p.from == fromPageId && p.to == toPageId)
  if (existing) {
    console.warn(`CmsStoryGraph: cannot create path. Path already exists from '${fromPageId}' to '${toPageId}'`)
    return
  }

  graph.value.paths.push({
    from: fromPageId,
    to: toPageId,
    label: '',
  })

  emitUpdate()
}

function deletePath(path) {
  const foundIndex = graph.value.paths.findIndex((p) => p.from == path.from && p.to == path.to)
  if (foundIndex >= 0) {
    graph.value.paths.splice(foundIndex, 1)
    emitUpdate()
  }
}

const currentOutgoingPaths = computed(() => {
  return graph.value.paths
    .filter((p) => p.from == currentPageId.value)
    .map((p) => ({
      ...p,
      nodeTo: graph.value.nodes.find((n) => n.id == p.to),
    }))
})

const graphWithClasses = computed({
  get() {
    return {
      nodes: graph.value.nodes.map((n) => ({
        ...n,
        class: n.id == currentPageId.value
          ? 'CmsStoryGraph__node CmsStoryGraph__node--active'
          : 'CmsStoryGraph__node',
      })),

      paths: graph.value.paths.map((p) => ({
        ...p,
        class: p.from == currentPageId.value
          ? 'CmsStoryGraph__path CmsStoryGraph__path--active'
          : 'CmsStoryGraph__path',
      })),
    }
  },

  set(newGraph) {
    graph.value = {
      nodes: newGraph.nodes.map((n) => ({ ...n, class: undefined })),
      paths: newGraph.paths.map((p) => ({ ...p, class: undefined })),
    }
    emitUpdate()
  },
})

const editableItem = ref() // TMP copy of a node or path object

function openVisibilityDialog(nodeOrPath) {
  editableItem.value = JSON.parse(JSON.stringify(nodeOrPath))
}

function onDialogAccept() {
  const isPath = editableItem.value.from && editableItem.value.to
  if (isPath) {
    const foundPath = graph.value.paths.find((p) => p.from == editableItem.value.from && p.to == editableItem.value.to)
    foundPath['v-if'] = editableItem.value['v-if']
  } else {
    const foundNode = graph.value.nodes.find((n) => n.id == editableItem.value.id)
    foundNode['v-if'] = editableItem.value['v-if']
  }

  emitUpdate()
  editableItem.value = null
}

function onDialogCancel() {
  editableItem.value = null
}


const availableOutgoingNodes = computed(() => {
  return graph.value.nodes
    .filter((node) => {
      if (node.id == currentPageId.value) {
        return false
      }

      const existingPathNdx = graph.value.paths.findIndex((p) => p.from == currentPageId.value && p.to == node.id)
      if (existingPathNdx >= 0) {
        return false
      }

      return true
    })
})

function setCurrentPageId(newId) {
  currentPageId.value = newId
  // emit('update:currentPageId', currentPageId.value)
}

function createPage() {
  const name = prompt('Page name', 'Untitled')

  const newPage = {
    id: `p${graph.value.nodes.length + 1}`,
    component: 'LayoutPage',
    title: name,
  }

  emit('update:story', {
    ...props.story,
    pages: props.story.pages.concat([newPage]),
  })
}
</script>

<template>
  <UiDialog
    :open="!!editableItem"
    @accept="onDialogAccept"
    @cancel="onDialogCancel"
  >
    <VmStatement
      v-if="editableItem"
      v-model="editableItem['v-if']"
      :default="{ and: [] }"
    />
  </UiDialog>

  <div class="CmsStoryGraph">
    <div class="CmsStoryGraph__stack">
      <UiGraphStack
        v-model:graph="graphWithClasses"
        @click-node="setCurrentPageId($event.id)"
      >
        <template #node-actions="{ node }">
          <UiIcon
            :src="node['v-if'] ? 'mdi:eye-settings' : 'mdi:eye-outline'"
          />
        </template>
      </UiGraphStack>

      <UiItem
        class="CmsStoryGraph__adderItem"
        icon="mdi:plus"
        :text="i18n.t('CmsStoryGraph.CreatePage')"
        @click="createPage"
      />
    </div>

    <div class="CmsStoryGraph__page">
      <UiItem
        class="CmsStoryGraph__headerItem"
        icon="mdi:file"
        :text="currentNode.text"
      />

      <UiDetails
        text="Visibility"
        class="outset"
      >
        <VmStatement
          v-if="currentNode"
          v-model="currentNode['v-if']"
          :default="{ and: [] }"
          @update:model-value="emitUpdate"
        />
      </UiDetails>

      <UiDetails
        text="Outgoing links"
        class="outset"
      >
        <table
          class="CmsStoryGraph__table"
          cellspacing="0"
          cellpadding="0"
        >
          <tbody>
            <tr
              v-for="(path, i) in currentOutgoingPaths"
              :key="i"
            >
              <td>
                <UiItem
                  class="CmsStoryGraph__pathItem"
                  icon="mdi:arrow-right-thick"
                  :text="path.nodeTo.text"
                >
                  <template #actions>
                    <UiIcon
                      :src="path['v-if'] ? 'mdi:eye-settings' : 'mdi:eye-outline'"
                      @click="openVisibilityDialog(path)"
                    />
                  </template>
                </UiItem>
              </td>
              <td>
                <input
                  v-model="path.label"
                  type="text"
                >
              </td>
              <td>
                <button
                  type="button"
                  @click="deletePath(path)"
                >
                  &times;
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>
                <UiInput
                  v-model="toPageId"
                  type="select-native"
                  :placeholder="i18n.t('CmsStoryGraph.CreatePathTo')"
                  :options="availableOutgoingNodes"
                  option-value="$.id"
                  option-text="$.text"
                  :disabled="!availableOutgoingNodes.length"
                  @update:model-value="createPath(toPageId); toPageId = null;"
                />
              </td>
              <td />
              <td />
            </tr>
          </tfoot>
        </table>
      </UiDetails>
    </div>
  </div>
</template>

<style lang="scss">
.CmsStoryGraph {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;

  &__headerItem,
  &__pathItem {
    user-select: none;
  }

  &__headerItem {
    --ui-item-padding: 8px;
  }

  &__pathItem {
    height: 32px;
    padding-left: 16px;
    align-items: stretch;

    .UiItem {
      &__actions .UiIcon {
        border-radius: 4px;
        width: 32px;
        height: 100%;
        cursor: pointer;
        &:hover {
          background-color: var(--ui-color-hover);
        }
      }
    }
  }

  &__page {
    flex: 1;
    margin: 0 12px;

    & > .UiDetails {
      margin-bottom: 1em;
      --ui-item-padding: 6px 8px;
    }

    table {
      width: 100%;
    }

    tbody {
      td {
        padding: 3px;
      }

      tr:hover {
        background-color: var(--ui-color-hover);
      }

      input {
        padding: 4px 8px;
      }
    }
  }

  &__stack {
    min-width: 340px;
    margin: auto;
    padding: 8px 0 24px 0;
    height: 100%;
    overflow-y: auto;
  }

  &__adderItem {
    user-select: none;
    --ui-item-padding: 12px 18px;

    margin: auto;
    margin-top: 18px;
    width: 180px;

    font-weight: bold;
    border: 2px dashed rgba(153, 153, 153, 0.5333333333);
    border-radius: 6px;

    align-items: stretch;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }

  &__node {
    cursor: pointer;
    user-select: none;
    border-radius: 6px;

    font-weight: bold;
    color: var(--ui-color-foreground);
    background-color: var(--ui-color-background);
    box-shadow: var(--outset-box-shadow);

    align-items: stretch;

    &--active {
      background-color: var(--ui-color-primary);
      color: #fff;
    }

    height: 47px;

    .UiItem {
      &__icon {
        height: 100%;
        width: 36px;
        cursor: move;
        &:hover {
          background-color: var(--ui-color-hover);
        }
      }

      &__body {
        padding: 2px 8px;
      }

      &__actions {
        .UiIcon {
          height: 100%;
          width: 36px;
        }
      }
    }
  }

  &__path {
    color: #000;
    border-color: #000;
    opacity: 0.1;
    border-width: 1px;

    &--active {
      border-width: 2px;
      color: var(--ui-color-primary);
      border-color: var(--ui-color-primary);
      opacity: 0.8;
    }
  }
}
</style>