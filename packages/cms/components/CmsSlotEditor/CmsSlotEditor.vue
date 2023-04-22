<script>
// global isDragging value
import { ref } from 'vue'
const isDragging = ref(false)
var _CmsSlotEditor_counter = 0
export default { inheritAttrs: false }
</script>

<script setup>
import { watch, nextTick, defineAsyncComponent } from 'vue'
import { useI18n } from '@/packages/i18n'
import SlotItem from './SlotItem.vue'
import SlotBlockLauncher from './SlotBlockLauncher.vue'
import { getBlockDefinition } from '../../functions'
import * as sel from '../CmsStoryEditor/selectedBlock'
// import draggable from 'vuedraggable'
const draggable = defineAsyncComponent(() => import('vuedraggable'))

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
  en: {
    'CmsSlotEditor.AddContent': 'Add content',
    'CmsSlotEditor.AddContentTo': 'Add content to',
  },
  es: {
    'CmsSlotEditor.AddContent': 'Agregar contenido',
    'CmsSlotEditor.AddContentTo': 'Agregar contenido en',
  },
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
  emit('update:slot', innerSlot.value.filter((block) => !block._placeholder))
}


function launchBlock(block, targetIndex = null) {
  if (targetIndex === null) {
    targetIndex = innerSlot.value.length
  }

  const arrBlocks = Array.isArray(block) ? JSON.parse(JSON.stringify(block)) : [JSON.parse(JSON.stringify(block))]

  let blockCounter = innerSlot.value.length
  arrBlocks.forEach((bl) => bl._key = `itm_${localCounter}_${blockCounter++}`)

  innerSlot.value.splice(targetIndex, 0, ...arrBlocks)
  emitUpdate()

  // Run block's defined "onCreated" function
  setTimeout(() => {
    arrBlocks.forEach((newBlock) => {
      const definition = getBlockDefinition(newBlock)
      definition?.onCreated?.(newBlock, blockRefs.value?.[targetIndex]?.innerRef)
    })
  }, 111)
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


function onMoveUp(index) {
  if (index === 0) {
    return
  }

  const block = innerSlot.value[index]
  innerSlot.value.splice(index, 1) // remove the item
  innerSlot.value.splice(index - 1, 0, block) // insert before
  emitUpdate()

  nextTick(() => {
    if (blockRefs.value?.[index - 1]?.$el) {
      blockRefs.value[index - 1].$el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  })
}

function onMoveDown(index) {
  if (index === innerSlot.value.length - 1) {
    return
  }

  const block = innerSlot.value[index]
  innerSlot.value.splice(index, 1) // remove the item
  innerSlot.value.splice(index + 1, 0, block) // insert after
  emitUpdate()

  nextTick(() => {
    if (blockRefs.value?.[index + 1]?.$el) {
      blockRefs.value[index + 1].$el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
    }
  })
}
</script>

<template>
  <draggable
    v-bind="$attrs"
    v-model="innerSlot"
    class="CmsSlotEditor"
    :class="{
      'CmsSlotEditor--dragging': isDragging,
      'CmsSlotEditor--empty': !innerSlot.length,
    }"
    item-key="_key"
    handle=".BlockScaffold__dragHandle"
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
          :open="true"
          @cancel="innerSlot.splice(index, 1)"
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

        @move-up="onMoveUp(index)"
        @move-down="onMoveDown(index)"
      />
    </template>

    <template #header>
      <slot name="header" />
    </template>

    <template #footer>
      <!-- block launcher at bottom -->
      <div class="CmsSlotEditor__footer">
        <SlotBlockLauncher
          :title="props.label
            ? i18n.t('CmsSlotEditor.AddContentTo') + ' ' + props.label
            : i18n.t('CmsSlotEditor.AddContent')"
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
}
</style>