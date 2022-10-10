<script>
// global isDragging value
import { ref } from 'vue'
const isDragging = ref(false)
var _CmsSlotEditor_counter = 0
export default { inheritAttrs: false }
</script>

<script setup>
import { watch, nextTick } from 'vue'

import draggable from 'vuedraggable'
import { useI18n } from '@/packages/i18n'

import SlotItem from './SlotItem.vue'
import SlotBlockLauncher from './SlotBlockLauncher.vue'
import { getBlockDefinition } from '../../functions'
import * as sel from '../CmsStoryEditor/selectedBlock'

const localCounter = _CmsSlotEditor_counter++

const props = defineProps({
  slot: {
    type: Array,
    required: false,
    default: () => [],
  },

  direction: {
    type: String,
    required: false,
    default: 'vertical', // 'vertical' | 'horizontal'
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
      ? newValue.map((item, index) => ({
        ...item,
        _key: item._key || `itm_${localCounter}_${index}`,
      }))
      : []
  },
  { immediate: true },
)

function emitUpdate() {
  // emit('update:slot', innerSlot.value)
  emit('update:slot', innerSlot.value.concat()) //shallow clone
}


function launchBlock(block, targetIndex = null) {
  if (targetIndex === null) {
    targetIndex = innerSlot.value.length
  }

  const arrBlocks = Array.isArray(block) ? JSON.parse(JSON.stringify(block)) : [JSON.parse(JSON.stringify(block))]

  innerSlot.value.splice(targetIndex, 0, ...arrBlocks)
  innerSlot.value = innerSlot.value.filter((block) => !block._placeholder)

  emitUpdate()

  nextTick(() => {
  // Run block's defined "onCreated" function
    arrBlocks.forEach((newBlock) => {
      const definition = getBlockDefinition(newBlock)
      definition?.onCreated?.(newBlock, blockRefs.value?.[targetIndex]?.innerRef)
    })
  })
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
  <draggable
    v-bind="$attrs"
    v-model="innerSlot"
    class="CmsSlotEditor"
    :class="{'CmsSlotEditor--dragging': isDragging}"
    item-key="_key"
    handle=".Bloh__headerItem"
    group="SlotEditor-drag"
    :direction="direction"
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
        :direction="direction"

        @update:block="onEditorUpdate(index, $event)"
        @select="selectBlock(index)"
        @deselect="deselectBlock(index)"
        @delete="removeBlockAt(index)"
        @insert-sibling="onInsertSibling(index, $event)"
      />
    </template>

    <template #footer>
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
    </template>
  </draggable>
</template>

<style lang="scss">
.CmsSlotEditor {
  &--dragging {
    min-height: 20px;

    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    .tiptap-editor-contents {
      pointer-events: none;
    }
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
}
</style>