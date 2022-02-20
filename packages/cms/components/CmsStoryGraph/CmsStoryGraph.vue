<script setup>
import { ref, watch, nextTick } from 'vue'
import { UiGraphGrid, UiIcon, UiItem, UiPopover } from '@/packages/ui/components'

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
const emit = defineEmits(['update:currentPageId', 'createPage', 'createPath'])

const graph = ref({
  nodes: [],
  paths: [],
})

watch(
  () => props.story?.pages.map(p => p.id).join(),
  () => {
    graph.value.nodes = props.story?.pages?.length
      ? props.story.pages.map((p, index) => ({
        id: p.id || index,
        text: p.info?.text || `Page ${index}`
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

    // // Add a "Create new page" node after every node
    // graph.value.nodes.forEach(node => {
    //   graph.value.nodes.push({
    //     id: `create-after-${node.id}`,
    //     text: 'Create page'
    //   })

    //   graph.value.paths.push({
    //     from: node.id,
    //     to: `create-after-${node.id}`,
    //   })
    // })

    // Add a "Create new page" node root
    graph.value.nodes.push({ id: '--creator--' })
    graph.value.paths.push({ from: '--root--', to: '--creator--' })
  },
  { immediate: true },
)

function onClickNode(nodeId) {
  if (targetPickerParent.value) {
    const newPath = {
      from: targetPickerParent.value,
      to: nodeId
    }
    cancelTargetPicker()

    if (newPath.from == newPath.to) {
      console.warn('Cannot create path to self')
      return
    }

    emit('createPath', newPath)
    graph.value.paths.push(newPath)
    return
  }

  emit('update:currentPageId', nodeId)
}


// Page creation widget
const inputEl = ref()
const isCreatorOpen = ref(false)
const newPage = ref({
  name: '',
  hash: '',
  parent: null
})

async function openPageCreator() {
  isCreatorOpen.value = true
  await nextTick()
  inputEl.value.focus()
}


function cancelPageCreator() {
  newPage.value = {
    name: '',
    hash: '',
    parent: null
  }
  isCreatorOpen.value = false
}

function createPage() {
  newPage.value.name = newPage.value.name.trim()
  if (!newPage.value.name) {
    return false
  }

  newPage.value.hash = toValidHash(newPage.value.name)
  emit('createPage', { ...newPage.value })

  isCreatorOpen.value = false
  newPage.value = {
    name: '',
    hash: '',
    parent: null
  }
}

function toValidHash(string) {
  if (!string) {
    return ''
  }

  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ +/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
}

// Target picker mode
const targetPickerParent = ref()

function startTargetPicker(parentId) {
  targetPickerParent.value = parentId
  document.addEventListener('keydown', escapeListener)
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
    :class="{ 'CmsStoryGraph--picking': !!targetPickerParent }"
    :graph="graph"
    @click-node="onClickNode"
  >
    <template #node="{ node }">
      <div v-if="node.id == '--root--'" class="CmsStoryGraph__dot"></div>
      <div v-else-if="node.id == '--creator--'">
        <UiItem
          v-show="!isCreatorOpen"
          class="CmsStoryGraph__node CmsStoryGraph__creator-item ui--noselect --nowrap"
          :class="{ 'CmsStoryGraph__node--active': currentPageId == node.id }"
          text="Create page"
          icon="mdi:plus"
          @click="openPageCreator()"
        />
        <div v-show="isCreatorOpen" class="CmsStoryGraph__creator-form">
          <input
            type="text"
            class="ui__input"
            placeholder="Page name"
            v-model="newPage.name"
            ref="inputEl"
            @keydown.esc="cancelPageCreator()"
            @keydown.enter="createPage()"
          />
          <button
            :disabled="!newPage.name.trim()"
            type="button"
            class="ui__button"
            @click="createPage()"
          >Create</button>
          <button
            type="button"
            class="ui__button ui__button--cancel"
            @click="cancelPageCreator()"
          >Cancel</button>
        </div>
      </div>
      <UiItem
        v-else
        class="CmsStoryGraph__node ui--noselect --nowrap"
        :class="{ 'CmsStoryGraph__node--active': currentPageId == node.id }"
        :text="node.text || node.id"
        @click="onClickNode(node.id)"
      >
        <template #actions>
          <UiPopover>
            <template #trigger>
              <UiIcon src="mdi:dots-vertical" class="CmsStoryGraph__node-trigger" />
            </template>
            <template #contents="{ close }">
              <div class="CmsStoryGraph__node-menu">
                <UiItem class="ui--clickable" text="Rename" icon="mdi:pencil" />
                <UiItem
                  class="ui--clickable"
                  text="Add path to ..."
                  icon="mdi:arrow-right-thick"
                  @click="startTargetPicker(node.id); close();"
                />
                <UiItem class="ui--clickable" text="Delete" icon="mdi:delete" />
              </div>
            </template>
          </UiPopover>
        </template>
      </UiItem>
    </template>
  </UiGraphGrid>
</template>

<style lang="scss">
.CmsStoryGraph {
  &__creator-form {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    position: relative;
    top: -6px;

    font-size: 14px;
    border-radius: var(--ui-radius);
    padding: var(--ui-padding);
    background-color: #f4f4f4;

    .ui__input {
      margin-right: 16px;
    }
  }

  &__dot {
    margin: auto;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--ui-color-primary);

    position: relative;
    top: 12px;
  }

  &__node {
    cursor: pointer;
    border-radius: var(--ui-radius);
    font-size: 14px;
    font-weight: bold;
    background-color: #f4f4f4;

    white-space: nowrap;
    max-width: 200px;
    // &.UiItem {
    //   .UiItem__body {
    //     white-space: nowrap;
    //   }

    //   & > .UiItem__body {
    //     font-weight: bold;
    //     padding: 9px 10px 9px 20px;
    //   }

    //   & > .UiItem__icon {
    //     padding: 9px 0 9px 10px;
    //     margin: 0;
    //   }

    //   & > .UiItem__actions {
    //     padding: 9px 10px 9px 0;
    //   }
    // }

    &:hover {
      background-color: #ffffaa;
    }

    &--active {
      background-color: var(--ui-color-primary);
      color: #fff;

      &:hover {
        background-color: var(--ui-color-primary);
        opacity: 1;
      }
    }
  }

  &__node-trigger {
    padding: var(--ui-padding);
  }

  &__node-menu {
    .UiItem {
      font-weight: normal;
      white-space: nowrap;
      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }

  // Target picker mode
  &--picking {
    .CmsStoryGraph__creator-item {
      pointer-events: none;
      opacity: 0.4;
      border: none !important;
    }

    .UiItem {
      border: 2px dashed var(--ui-color-primary);

      &__actions {
        display: none;
      }
    }
  }
}
</style>