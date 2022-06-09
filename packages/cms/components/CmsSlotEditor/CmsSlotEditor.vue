<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { useI18n } from '@/packages/i18n'

import { getPluginData } from '../../functions'
import CmsBlockEditor from '../CmsBlockEditor/CmsBlockEditor.vue'
import SlotBlockLauncher from './SlotBlockLauncher.vue'

const props = defineProps({
  slot: {
    type: Array,
    required: false,
    default: () => [],
  },

  groupName: {
    type: String,
    required: false,
    default: 'slot-draggable',
  },
})

const emit = defineEmits(['update:slot', 'update:dragging'])

const i18n = useI18n({
  en: { 'CmsSlotEditor.AddContent': 'Add content' },
  es: { 'CmsSlotEditor.AddContent': 'Agregar contenido' },
})

const innerSlot = ref([])

watch(
  () => props.slot,
  (newValue) => {
    innerSlot.value = Array.isArray(newValue) ? JSON.parse(JSON.stringify(newValue)) : []
  },
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:slot', innerSlot.value.concat())
}

async function onDraggableUpdate() {
  await nextTick()
  emitUpdate()
}

function onEditorUpdate(slotIndex, newBlock) {
  innerSlot.value[slotIndex] = newBlock
  emitUpdate()
}

function deleteBlock(index) {
  innerSlot.value.splice(index, 1)
  emitUpdate()
}

const isDragging = ref(false)

function onDraggableStart() {
  isDragging.value = true
  emit('update:dragging', isDragging.value)
}

function onDraggableEnd() {
  isDragging.value = false
  emit('update:dragging', isDragging.value)
}

/* Perform actions before and after a new block is created */
const pluginData = getPluginData()

function onBeforeCreateBlock(block) {
  if (typeof pluginData?.onBeforeCreateBlock == 'function') {
    try {
      const result = pluginData.onBeforeCreateBlock(block)
      if (result === false) {
        return false
      }
      if (result && typeof result == 'object') {
        return result
      }

      return block

    } catch (e) {
      return false
    }
  }

  return block
}


let listenForMountedEvents = false

function launchBlock(index, block, position) {
  const newBlock = onBeforeCreateBlock(block)
  if (!newBlock) {
    console.warn('Block creation halted by onBeforeCreateBlock')
    return
  }

  listenForMountedEvents = true
  const targetIndex = position == 'before' ? index : index + 1
  innerSlot.value.splice(targetIndex, 0, JSON.parse(JSON.stringify(newBlock)))
  emitUpdate()
}

function appendBlock(block) {
  const newBlock = onBeforeCreateBlock(block)
  if (!newBlock) {
    console.warn('Block creation halted by onBeforeCreateBlock')
    return
  }

  listenForMountedEvents = true
  innerSlot.value.push(JSON.parse(JSON.stringify(newBlock)))
  emitUpdate()
}

function onBlockEditorMounted(vNode) {
  if (!listenForMountedEvents) {
    return
  }

  if (vNode?.component?.exposed?.onBlockCreated) {
    vNode.component.exposed.onBlockCreated()
  }

  listenForMountedEvents = false
}

const hoveredIndex = ref(-1)
</script>

<template>
  <div
    class="CmsSlotEditor"
    :class="{ 'CmsSlotEditor--dragging': isDragging }"
  >
    <draggable
      v-model="innerSlot"
      class="CmsSlotEditor__draggable"
      :direction="$attrs?.direction == 'row' ? 'horizontal' : 'vertical'"
      :group="groupName"
      item-key="uid"
      handle=".Block__drag-handle"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"
      v-bind="$attrs"
      @update:model-value="onDraggableUpdate"
      @start="onDraggableStart()"
      @end="onDraggableEnd()"
    >
      <template #item="{ element, index }">
        <div
          :class="[
            'SlotItem',
            `SlotItem--${$attrs?.direction || 'column'}`,
            { 'SlotItem--before-hovered': index === hoveredIndex - 1 }
          ]"
          :style="{display: 'flex', flexDirection: $attrs?.direction || 'column'}"
        >
          <SlotBlockLauncher
            v-if="index === 0"
            class="SlotItem__launcher SlotItem__launcher--before"
            :direction="$attrs?.direction"
            :title="`Insert before ${element.title || element.component}`"
            @input="launchBlock(index, $event, 'before')"
          />
          <CmsBlockEditor
            style="flex: 1"
            class="SlotItem__editor"
            :block="element"
            @vnode-mounted="onBlockEditorMounted"
            @update:block="onEditorUpdate(index, $event)"
            @delete="deleteBlock(index)"
            @mouseenter="hoveredIndex = index"
            @mouseleave="hoveredIndex = -1"
          />
          <SlotBlockLauncher
            class="SlotItem__launcher SlotItem__launcher--after"
            :direction="$attrs?.direction"
            :title="`Insert after ${element.title || element.component}`"
            @input="launchBlock(index, $event, 'after')"
          />
        </div>
      </template>
    </draggable>

    <SlotBlockLauncher
      v-if="!innerSlot.length"
      class="LoneLauncher"
      :label="i18n.t('CmsSlotEditor.AddContent')"
      open
      @input="appendBlock"
    />
  </div>
</template>

<style lang="scss">
.SlotItem {
  // &:hover {
  //   z-index: 1;
  // }

  &:hover &__launcher {
    z-index: 1;
  }
}

.CmsSlotEditor {
  // draggable container
  & > &__draggable {
    // min-height: 24px;
    min-width: 100%;
  }

  &--dragging {
    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    // !!! -> What about <draggable> in nested block faces (i.e. LayoutGroupEditor) ?
    .BlockScaffold__face {
      pointer-events: none;
    }
    // .BlockScaffold__face > .tiptap-editor-contents {
    //   pointer-events: none;
    // }
  }

  .LoneLauncher {
    border: 0;
    margin: 0;

    .SlotBlockLauncher__trigger {
      position: initial;

      .UiItem {
        --ui-item-padding: 8px 12px;
        font-size: 1em;
        background-color: #999;

        &:hover {
          background-color: var(--ui-color-primary);
        }
      }
    }
  }
}

// Show picker when container is hovered
.SlotItem {
  & > &__launcher {
    opacity: 0;
  }

  &:hover > &__launcher {
    opacity: 0.5;
  }

  & > &__launcher:hover,
  & > &__launcher.SlotBlockLauncher--open {
    opacity: 1 !important;
  }
}

// SlotItems surounding hovered
.SlotItem {
  & > .SlotItem__launcher--after {
    top: 2px;
  }

  &--before-hovered {
    & > .SlotItem__launcher--after {
      opacity: 0.5;
      z-index: 2;
    }
  }
}


// Show the launcher of the last block in the LayoutPage !!!
.CmsSlotEditor > .LayoutPage {
  & > .SlotItem {
    &:last-child {
      & > .SlotItem__launcher--before {
        .SlotBlockLauncher__trigger {
          top: auto;
          bottom: 2px;
        }
      }

      & > .SlotItem__launcher--after {
        position: relative;
        top: 4px;
        opacity: 0.7;

        .SlotBlockLauncher__trigger {
          top: 2px;
        }
      }
    }
  }
}
</style>