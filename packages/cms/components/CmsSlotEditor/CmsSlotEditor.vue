<script setup>
import { ref, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'

import CmsBlockEditor from '../CmsBlockEditor/CmsBlockEditor.vue'
import CmsBlockPicker from '../CmsBlockPicker/CmsBlockPicker.vue'

const props = defineProps({
  slot: {
    type: Array,
    required: false,
    default: () => [],
  },

  showLauncher: {
    type: Boolean,
    required: false,
    default: false,
  },

  groupName: {
    type: String,
    required: false,
    default: 'slot-draggable',
  },
})

const emit = defineEmits(['update:slot', 'update:dragging'])

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

const focusedIndexes = ref({})

/* Perform actions after a new block is created */
let listenForMountedEvents = false

function launchBlock(index, block, position) {
  listenForMountedEvents = true
  const targetIndex = position == 'top' ? index : index + 1
  innerSlot.value.splice(targetIndex, 0, block)
  emitUpdate()
}

function appendBlock(newBlock) {
  listenForMountedEvents = true
  innerSlot.value.push(newBlock)
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

</script>

<template>
  <div
    class="CmsSlotEditor"
    :class="{ 'CmsSlotEditor--dragging': isDragging }"
  >
    <draggable
      v-model="innerSlot"
      :group="groupName"
      item-key="uid"
      handle=".Block__drag-handle"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"
      direction="vertical"
      @update:model-value="onDraggableUpdate"
      @start="onDraggableStart()"
      @end="onDraggableEnd()"
    >
      <template #item="{ element, index }">
        <div
          class="SlotBlock"
          :class="{ 'SlotBlock--focused': focusedIndexes[index] }"
        >
          <template v-if="showLauncher">
            <CmsBlockPicker
              v-for="position in ['bottom', 'top']"
              :key="position"
              class="SlotBlock__adder"
              text="Agregar contenido"
              :placement="position"
              @input="launchBlock(index, $event, position)"
              @update:open="focusedIndexes[index] = $event"
            />
          </template>

          <CmsBlockEditor
            class="SlotBlock__editor"
            :block="element"
            @vnode-mounted="onBlockEditorMounted"
            @update:block="onEditorUpdate(index, $event)"
            @delete="deleteBlock(index)"
          />
        </div>
      </template>
    </draggable>

    <CmsBlockPicker
      v-if="showLauncher"
      class="CmsSlotEditor__adder"
      text="Agregar contenido"
      @input="appendBlock"
    />
  </div>
</template>

<style lang="scss">
.CmsSlotEditor {
  & > div:first-child {
    // draggable container
    min-width: 100%;
    min-height: 24px;
  }

  &--dragging {
    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    .BlockScaffold__face {
      pointer-events: none;
    }
  }

  &__adder {
    padding: 8px;
    min-height: 58px;
  }
}

.SlotBlock {
  position: relative;
  &:hover {
    z-index: 1;
  }

  &__adder {
    min-width: 80px;
    text-align: center;

    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    &:hover {
      left: 0;
      right: 0;
      transform: translateX(0);
    }

    &.CmsBlockPicker--top {
      bottom: 100%;
    }

    &.CmsBlockPicker--bottom {
      top: 100%;
    }

    &.CmsBlockPicker--hovered {
      z-index: 1;
    }
  }

  // Show/hide adders on hover
  & > &__adder {
    transition: opacity var(--ui-duration-quick);
    opacity: 0;
    pointer-events: none;
  }

  // &--focused > &__adder,
  &:hover > &__adder {
    opacity: 1;
    pointer-events: initial;
  }
}
</style>