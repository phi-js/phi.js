<script setup>
import { ref } from 'vue'

import { UiItem } from '@/packages/ui'
import CmsBlockPicker from '../CmsBlockPicker/CmsBlockPicker.vue'
import { getPluginData } from '../../functions'
import SlotItem from './SlotItem.vue'

import BlockWindow from '../CmsBlockEditor/BlockWindow.vue'

const pluginData = getPluginData()

const props = defineProps({
  direction: {
    type: String,
    required: false,
    default: 'column',
    validator: (v) => ['row', 'column'].includes(v),
  },

  label: {
    type: String,
    required: false,
    default: '',
  },

  title: {
    type: String,
    required: false,
    default: null,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['input'])

const isOpen = ref(props.open)
const isPopupOpen = ref(props.open)

const stagingBlock = ref()

function onTriggerClick() {
  isOpen.value = !isOpen.value
  isPopupOpen.value = isOpen.value || props.open
}

function onBlockPickerInput(blockDefinition) {
  const candidateBlock = JSON.parse(JSON.stringify({
    ...blockDefinition.block,
    component: blockDefinition.name,
  }))

  const newBlock = onBeforeCreateBlock(candidateBlock)
  if (!newBlock) {
    console.warn('Block creation halted by onBeforeCreateBlock')
    return
  }

  if (blockDefinition.staging === false) {
    emit('input', newBlock)
    isOpen.value = false
    return
  }

  stagingBlock.value = newBlock
}

function onSlotComponentInput(block) {
  const newBlock = onBeforeCreateBlock(block)
  emit('input', newBlock)
}


/* Perform actions before and after a new block is created */
function onBeforeCreateBlock(block) {
  if (typeof pluginData?.onBeforeCreateBlock == 'function') {
    try {
      // Run onBeforeCreateBlock on children first
      if (block?.slot?.length) {
        for (let i = 0; i < block.slot.length; i++) {
          block.slot[i] = onBeforeCreateBlock(block.slot[i])
        }
      }

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

function onStagingAccept() {
  emit('input', stagingBlock.value)
  stagingBlock.value = null
  isOpen.value = props.open
}

function onStagingCancel() {
  stagingBlock.value = null
  isOpen.value = props.open
}

// const elBox = ref()
function onPickerUpdateOpen($event) {
  if (!stagingBlock.value) {
    isOpen.value = $event || props.open
    // if (isOpen.value && window.innerWidth < 600) { // 2DO: Check CORRECTLY to see if using mobile
    //   elBox.value?.scrollIntoView?.()
    // }
  }
}

</script>

<template>
  <div
    class="SlotBlockLauncher"
    :class="[
      `SlotBlockLauncher--${props.direction}`,
      { 'SlotBlockLauncher--open': isOpen }
    ]"
  >
    <template v-if="stagingBlock">
      <SlotItem
        :block="stagingBlock"
        :selected="true"
      />
      <BlockWindow
        v-model:block="stagingBlock"
        open
        @accept="onStagingAccept"
        @cancel="onStagingCancel"
      />
    </template>

    <UiItem
      icon="mdi:plus"
      :text="props.label"
      class="SlotBlockLauncher__trigger"
      :title="props.title"
      @click="onTriggerClick"
    />

    <CmsBlockPicker
      v-model:open="isPopupOpen"
      @update:open="onPickerUpdateOpen"
      @input="onBlockPickerInput($event)"
    >
      <template #body="{ close }">
        <Component
          :is="pluginData.getSlotComponent('BlockLauncher')"
          @input="onSlotComponentInput($event); close();"
        />
      </template>
    </CmsBlockPicker>
  </div>
</template>

<style lang="scss">
.SlotBlockLauncher {
  &__trigger {
    display: inline-flex;
    --ui-item-padding: 8px 14px;

    user-select: none;
    font-size: 0.8rem;
    font-weight: bold;

    border-radius: 5px;
    border: 2px dashed #99999988;
    opacity: 0.6;

    cursor: pointer;
    &:hover {
      border: 2px solid var(--ui-color-primary);
      color: var(--ui-color-primary);
      opacity: 1;
    }


    transition: all var(--ui-duration-snap);
    gap: 0;
    .UiItem {
      &__body {
        overflow: hidden;
        max-width: 0;
      }
    }

    &:hover {
      gap: 8px;
      .UiItem {
        &__body {
          max-width: none;
        }
      }
    }
  }
}
</style>