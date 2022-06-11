<script>
export default { inheritAttrs: false }
var _CmsSlotEditor_counter = 0
</script>

<script setup>
import { nextTick, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useI18n } from '@/packages/i18n'

import CmsBlockEditor from '../CmsBlockEditor/CmsBlockEditor.vue'
import SlotBlockLauncher from './SlotBlockLauncher.vue'

import activeUid from './activeUid.js'

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

  withContentAdder: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:slot', 'update:dragging'])

const i18n = useI18n({
  en: { 'CmsSlotEditor.AddContent': 'Add content' },
  es: { 'CmsSlotEditor.AddContent': 'Agregar contenido' },
})

const innerSlot = ref([])

const localCounter = _CmsSlotEditor_counter++

watch(
  () => props.slot,
  (newValue) => {
    innerSlot.value = Array.isArray(newValue) ? JSON.parse(JSON.stringify(newValue)) : []

    let count = 1
    innerSlot.value.forEach((block) => {
      block._uid = block._uid ? block._uid : `_${localCounter}_${block.component}_${count++}`
    })
  },
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:slot', innerSlot.value.map((block) => ({ ...block, _uid: undefined })))
}

// async function onDraggableUpdate() {
//   await nextTick()
//   emitUpdate()
// }
function onDraggableUpdate() {
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

const refEditors = ref([])

function launchBlock(block, targetIndex = null) {
  if (targetIndex === null) {
    targetIndex = innerSlot.value.length
  }
  innerSlot.value.splice(targetIndex, 0, JSON.parse(JSON.stringify(block)))
  emitUpdate()

  nextTick(() => {
    activeUid.value = refEditors.value?.[targetIndex]?.block?._uid
    refEditors.value?.[targetIndex]?.onBlockCreated?.()
  })
}

function onEditorClick(element) {
  if (activeUid.value != element._uid && window?.navigator?.vibrate) {
    window.navigator.vibrate(1)
  }

  activeUid.value = element._uid
  registerBlurListeners()
}

/*
Handle click-outside and ESC keypress to unset current active block.

Since the event that gives focus to the block has a .stop:
<CmsBlockEditor @click.stop="onEditorClick(element)"

then any event registered in window.addEventListener('click') will not fire.
Only clicks from other elements will trigger it, so it is equivalent to a "click outsite"
*/
const onClickOutside = (evt) => {
  // EXCEPTION!
  // Ignore clicks on UiWindow and UiPopovers (i.e. )
  if (evt.target.closest('.UiWindow, *[data-tippy-root]')) {
    evt.stopPropagation()
    return
  }

  activeUid.value = null
  clearBlurListeners()
}

const onKeyPress = (e) => {
  if ((e.code == 'Escape')) {
    activeUid.value = null
    clearBlurListeners()
  }
}

function registerBlurListeners() {
  clearBlurListeners() // clear existing

  window.addEventListener('click', onClickOutside)
  window.addEventListener('keydown', onKeyPress, true)
}

function clearBlurListeners() {
  window.removeEventListener('click', onClickOutside)
  window.removeEventListener('keydown', onKeyPress, true)
}
</script>

<template>
  <div
    v-bind="$attrs"
    class="CmsSlotEditor"
    :class="{ 'CmsSlotEditor--dragging': isDragging }"
  >
    <draggable
      v-model="innerSlot"
      class="CmsSlotEditor__draggable"
      :direction="$attrs?.direction == 'row' ? 'horizontal' : 'vertical'"
      :style="{
        display: $attrs?.direction == 'row' ? 'flex' : 'block',
        flexDirection: $attrs?.direction || 'column',
        flexWrap: 'wrap',
      }"
      :group="groupName"
      item-key="_uid"
      handle=".Block__drag-handle"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"

      @update:model-value="onDraggableUpdate"
      @start="onDraggableStart()"
      @end="onDraggableEnd()"
    >
      <template #item="{ element, index }">
        <div
          :class="[
            'SlotItem',
            `SlotItem--${$attrs?.direction || 'column'}`,
            `SlotItem--is-${element.component}`,
            {'SlotItem--active': activeUid === element._uid},
          ]"
          :style="{flex: 1, display: 'flex', flexDirection: $attrs?.direction || 'column'}"
        >
          <SlotBlockLauncher
            class="SlotItem__launcher SlotItem__launcher--before"
            :direction="$attrs?.direction"
            :title="`Insert before ${element.title || element.component}`"
            @input="launchBlock($event, index)"
            @click="activeUid = null"
          />
          <CmsBlockEditor
            :ref="e => refEditors[index] = e"
            style="flex: 1"
            class="SlotItem__editor"
            :block="element"
            @update:block="onEditorUpdate(index, $event)"
            @delete="deleteBlock(index)"
            @click.stop="onEditorClick(element)"
          />
          <SlotBlockLauncher
            v-if="index === innerSlot.length - 1"
            class="SlotItem__launcher SlotItem__launcher--after"
            :direction="$attrs?.direction"
            :title="`Insert after ${element.title || element.component}`"
            @input="launchBlock($event, index + 1)"
            @click="activeUid = null"
          />
        </div>
      </template>
    </draggable>

    <SlotBlockLauncher
      v-if="props.withContentAdder || !innerSlot.length"
      class="LoneLauncher"
      :label="i18n.t('CmsSlotEditor.AddContent')"
      :open="true"
      @input="launchBlock($event)"
    />
  </div>
</template>