<script setup>
import { nextTick, ref } from 'vue'

import { UiItem } from '@/packages/ui'
import CmsBlockPicker from '../CmsBlockPicker/CmsBlockPicker.vue'
import { CmsBlockEditor } from '../CmsBlockEditor'
import { getPluginData } from '../../functions'

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
const isPopupOpen = ref(false)
const isTriggerHovered = ref(false)

const stagingBlock = ref()

function onTriggerClick() {
  isOpen.value = !isOpen.value

  setTimeout(() => {
    isPopupOpen.value = isOpen.value || props.open
  }, 200)
}

const elStaging = ref()

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
  nextTick(() => elStaging.value.openAction(0))
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

const elBox = ref()

function onPickerUpdateOpen($event) {
  if (!stagingBlock.value) {
    isOpen.value = $event || props.open

    if (isOpen.value && window.innerWidth < 600) { // 2DO: Check CORRECTLY to see if using mobile
      elBox.value?.scrollIntoView?.()
    }
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
        'SlotBlockLauncher--teasing': isTriggerHovered,
      }
    ]"
  >
    <div
      v-show="!isOpen"
      class="SlotBlockLauncher__trigger"
      @click="onTriggerClick"
      @mouseenter="isTriggerHovered = true"
      @mouseleave="isTriggerHovered = false"
    >
      <UiItem
        icon="mdi:plus"
        :title="title"
      />
    </div>

    <CmsBlockPicker
      v-model:open="isPopupOpen"
      @update:open="onPickerUpdateOpen"
      @input="onBlockPickerInput($event)"
    >
      <template #trigger="{ toggle }">
        <div
          v-show="!stagingBlock"
          ref="elBox"
          class="SlotBlockLauncher__box"
        >
          <div
            @click="toggle"
            v-text="props.label"
          />
        </div>
        <CmsBlockEditor
          v-if="stagingBlock"
          ref="elStaging"
          v-model:block="stagingBlock"
          class="SlotBlockLauncher__stagedEditor"
          @update:block="onStagingAccept"
          @cancel="onStagingCancel"
        />
      </template>

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
    position: absolute;
    padding: 6px;

    .UiItem {
      user-select: none;
      font-size: 12px;
      font-weight: bold;

      background-color: #525659;
      color: #fff;

      border-radius: 5px;
    }

    &:hover .UiItem {
      background-color: var(--ui-color-primary);
      color: #eee;
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

      border: 2px dashed var(--ui-color-primary);
      border-radius: 3px;

      font-weight: bold;
      font-size: 1em;

      cursor: pointer;
      &:hover {
        background-color: rgba(255,255,255, 0.1);
      }
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

    .BlockScaffold__toolbar-container {
      display: none;
    }
  }
}



// the trigger is 32x32 px, position centered
.SlotBlockLauncher--column {
  .SlotBlockLauncher__trigger {
    top: -16px;
    left: calc(50% - 16px);
  }

  .SlotBlockLauncher__box {
    height: 0;
  }

  &.SlotBlockLauncher--open .SlotBlockLauncher__box {
    height: 60px;
  }

  &.SlotBlockLauncher--teasing {
    margin-top: -2px;
    margin-bottom: -2px;
    border-top: 4px dashed var(--ui-color-primary);
  }
}


.SlotBlockLauncher--row {
  .SlotBlockLauncher__trigger {
    top: calc(50% - 16px);
    left: -16px;
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

  &.SlotBlockLauncher--teasing {
    margin-left: -3px;
    border-left: 3px dashed var(--ui-color-primary);
  }

  ///damn
  & > .CmsBlockPicker,
  & > .CmsBlockPicker > .UiPopover,
  & > .CmsBlockPicker > .UiPopover > .UiPopover__trigger {
    height: 100%;
  }
}
</style>