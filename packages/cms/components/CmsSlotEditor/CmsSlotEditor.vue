<script>
// global isDragging value
import { ref } from 'vue'
const isDragging = ref(false)
var _CmsSlotEditor_counter = 0
export default { inheritAttrs: false }
</script>

<script setup>
import { inject, watch, shallowRef, nextTick } from 'vue'

import draggable from 'vuedraggable'

import { useI18n } from '@/packages/i18n'
import { UiScaffold } from '@/packages/ui'

import SlotItem from './SlotItem.vue'
import SlotBlockLauncher from './SlotBlockLauncher.vue'
import { getBlockDefinition } from '../../functions'

import * as sel from '../CmsStoryEditor/selectedBlock'

const props = defineProps({
  slot: {
    type: Array,
    required: false,
    default: () => [],
  },

  label: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:slot'])

const i18n = useI18n({
  en: { 'CmsSlotEditor.AddContent': 'Add content' },
  es: { 'CmsSlotEditor.AddContent': 'Agregar contenido' },
})

const blockRefs = ref([])
const innerSlot = ref([])

watch(
  () => props.slot,
  (newValue) => {
    innerSlot.value = Array.isArray(newValue)
      ? newValue.map((item) => ({ ...item, _key: item._key || `itm_${_CmsSlotEditor_counter++}` }))
      : []
  },
  { immediate: true },
)

function emitUpdate() {
  // emit('update:slot', innerSlot.value)
  emit('update:slot', innerSlot.value.concat()) //shallow clone
}



// The parent CmsStoryEditor
const CmsStoryEditor = inject('_cms_CmsStoryEditor', null)

function openBlockWindow(index, actionId = null) {
  CmsStoryEditor?.openBlockWindow?.(blockRefs.value[index], actionId)
}


function launchBlock(block, targetIndex = null) {
  if (targetIndex === null) {
    targetIndex = innerSlot.value.length
  }

  const arrBlocks = Array.isArray(block) ? JSON.parse(JSON.stringify(block)) : [JSON.parse(JSON.stringify(block))]

  // Run block's defined "onCreated" function
  arrBlocks.forEach((newBlock) => {
    const definition = getBlockDefinition(newBlock)
    definition?.onCreated?.(newBlock)
  })

  innerSlot.value.splice(targetIndex, 0, ...arrBlocks)
  innerSlot.value = innerSlot.value.filter((block) => !block._placeholder)
  emitUpdate()
}

function onEditorUpdate(slotIndex, newBlock) {
  innerSlot.value[slotIndex] = newBlock
  emitUpdate()
}

async function onDraggableUpdate() {
  await nextTick() // Fixes glitch when dragging blocks outside a nested CmsSlotEditor
  emitUpdate()
}

function onDraggableStart() {
  isDragging.value = true
}
function onDraggableEnd() {
  isDragging.value = false
}


// Singleton Selected block
function selectBlock(index) {
  sel.setSelectedBlock(blockRefs.value[index])
}

function deselectBlock() {
  sel.clearSelectedBlock()
}

function isSelected(index) {
  return sel.selectedBlock.value === blockRefs.value[index]
}



// hovered SlotItem instance
const hoveredInstance = shallowRef()
let deselectTimeout = null

function hoverBlock(blockIndex) {
  if (isDragging.value) {
    return
  }

  clearTimeout(deselectTimeout)
  hoveredInstance.value = blockRefs.value[blockIndex]
}

function clearHovered() {
  clearTimeout(deselectTimeout)
  deselectTimeout = setTimeout(() => hoveredInstance.value = null, 99)
}


async function removeBlockAt(index) {
  innerSlot.value.splice(index, 1)
  await nextTick() // fixes bug when dragging block from/to nested CmsSlotEditors
  emitUpdate()
}

function onInsertSibling(index, position = null) {
  let targetIndex = index
  if (position == 'after') {
    targetIndex++
  }

  innerSlot.value.splice(targetIndex, 0, { _placeholder: true })
}

</script>

<template>
  <div
    class="CmsSlotEditor"
    :class="{'CmsSlotEditor--dragging': isDragging}"
  >
    <draggable
      v-bind="$attrs"
      v-model="innerSlot"
      class="CmsSlotEditor__draggable"
      item-key="_key"
      handle=".Bloh__headerItem"
      group="SlotEditor-drag"
      direction="vertical"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"
      @update:model-value="onDraggableUpdate"
      @start="onDraggableStart()"
      @end="onDraggableEnd()"
    >
      <template #item="{ element, index }">
        <div v-if="element._placeholder">
          <SlotBlockLauncher
            :text="i18n.t('CmsSlotEditor.AddContent')"
            :title="props.label"
            :label="props.label || i18n.t('CmsSlotEditor.AddContent')"
            :open="true"
            @input="launchBlock($event, index)"
          />
        </div>
        <SlotItem
          v-else
          :ref="e => blockRefs[index] = e"

          :block="element"
          :selected="isSelected(index)"
          @update:block="onEditorUpdate(index, $event)"
          @select="selectBlock(index)"
          @deselect="deselectBlock(index)"

          @delete="removeBlockAt(index)"
          @open-editor="openBlockWindow(index, $event)"
          @insert-sibling="onInsertSibling(index, $event)"

          @mouseenter="hoverBlock(index)"
          @mouseleave="clearHovered()"
        />
      </template>
    </draggable>

    <!-- block launcher at bottom -->
    <div
      class="CmsSlotEditor__footer"
      :class="{'CmsSlotEditor__footer--not-empty': innerSlot.length > 0}"
    >
      <SlotBlockLauncher
        :text="i18n.t('CmsSlotEditor.AddContent')"
        :title="props.label"
        :label="props.label || i18n.t('CmsSlotEditor.AddContent')"
        :open="false"
        @input="launchBlock($event)"
      />
    </div>

    <!-- scaffold around hovered element -->
    <UiScaffold
      v-if="hoveredInstance"
      :element="hoveredInstance.$el"
      class="CmsSlotEditor__hoverScaffold"
    >
      <label
        v-text="hoveredInstance.block.title
          || hoveredInstance.definition.title
          || hoveredInstance.block.component"
      />
    </UiScaffold>
  </div>
</template>

<style lang="scss">
.CmsSlotEditor {
  &--dragging {
    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    .tiptap-editor-contents {
      pointer-events: none;
    }

    .Bloh__toolbar-container {
      display: none;
    }
  }

  // vuedraggable instance
  & > .CmsSlotEditor__draggable {
    min-height: 10px;
  }

  &__footer {
    padding: 18px 0;

    .SlotBlockLauncher {
      &__trigger {
        // justify-content: flex-start;
        .UiItem {
          --ui-item-padding: 6px 12px;
        }
      }
    }
  }

  &__hoverScaffold {
    --scaffold-transition-duration: 111ms;
    pointer-events: none;
    label {
      white-space: nowrap;
      font-size: 0.8rem;
      font-weight: bold;
    }
  }
}
</style>