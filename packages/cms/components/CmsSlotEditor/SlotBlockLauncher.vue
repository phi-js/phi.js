<script setup>
import { ref } from 'vue'

import { UiItem } from '@/packages/ui'
import CmsBlockPicker from '../CmsBlockPicker/CmsBlockPicker.vue'
import { getPluginData } from '../../functions'
import { CmsBlock } from '../CmsBlock'
import BlockWindow from '../CmsBlockEditor/BlockWindow.vue'

const pluginData = getPluginData()

const props = defineProps({
  direction: {
    type: String,
    required: false,
    default: 'column',
    validator: (v) => ['row', 'column'].includes(v),
  },

  text: {
    type: String,
    required: false,
    default: null,
  },

  label: {
    type: String,
    required: false,
    default: 'Adding content here',
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
      {
        'SlotBlockLauncher--open': isOpen,
      }
    ]"
  >
    <div
      v-show="!isOpen"
      class="SlotBlockLauncher__trigger"
      :title="props.title"
      @click="onTriggerClick"
    >
      <UiItem
        icon="mdi:plus"
        :text="props.text"
        :subtext="props.title"
      />
    </div>

    <template v-if="stagingBlock">
      <CmsBlock :block="stagingBlock" />
      <BlockWindow
        v-model:block="stagingBlock"
        open
        @accept="onStagingAccept"
        @cancel="onStagingCancel"
      />
    </template>

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
  position: relative;

  &__trigger {
    cursor: pointer;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;

    .UiItem {
      flex: 1;
      --ui-item-padding: 12px 16px;

      user-select: none;
      font-size: 0.8rem;
      font-weight: bold;

      border-radius: 5px;
      border: 2px dashed #99999988;
      opacity: 0.5;
    }

    &:hover .UiItem {
      // background-color: var(--ui-color-hover);
      border: 2px solid var(--ui-color-primary);
      color: var(--ui-color-primary);
      opacity: 1;
    }
  }

  &__box {
    display: flex;
    flex-direction: column;

    user-select: none;

    transition:
      width var(--ui-duration-snap),
      height var(--ui-duration-snap),
      opacity var(--ui-duration-snap);

    overflow: hidden;

    div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      font-weight: bold;
      font-size: 1em;

      background-color: var(--ui-color-hover);
    }
  }
}

.SlotBlockLauncher {
  &__stagedEditor {
    position: relative;
    border: 1px solid transparent; // prevent margin collapse

    &::before {
      content: '';

      pointer-events: none;
      position: absolute;
      top: -5px;
      right: -5px;
      bottom: -5px;
      left: -5px;

      border-radius: 5px;
      border: 2px dashed var(--ui-color-primary);
    }
  }
}




.SlotBlockLauncher--column {
  .SlotBlockLauncher__box {
    height: 0;
  }

  &.SlotBlockLauncher--open .SlotBlockLauncher__box {
    height: 60px;
  }

}


.SlotBlockLauncher--row {
  .SlotBlockLauncher__trigger {
    position: absolute;
    flex-direction: column;
    top: 0;
    bottom: 0;
    left: -12px;
    right: auto;
  }

  .SlotBlockLauncher__box {
    width: 0;
    height: 100%;
  }

  &.SlotBlockLauncher--open {
    flex: 1;
  }

  &.SlotBlockLauncher--open .SlotBlockLauncher__box {
    width: auto;
  }

  ///damn
  & > .CmsBlockPicker,
  & > .CmsBlockPicker > .UiPopover,
  & > .CmsBlockPicker > .UiPopover > .UiPopover__trigger {
    height: 100%;
  }
}
</style>