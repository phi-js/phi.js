<script setup>
import { ref, watch, nextTick } from 'vue'
import CmsBlockEditor from '../CmsBlockEditor/CmsBlockEditor.vue'
import { CmsBlockPicker } from '../CmsBlockPicker'
import draggable from 'vuedraggable/src/vuedraggable'

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
    const incoming = Array.isArray(newValue) ? JSON.parse(JSON.stringify(newValue)) : []
    innerSlot.value = incoming.map((item, i) => ({ ...item, id: i }))
  },
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:slot', innerSlot.value)
}

function appendBlock(newBlock) {
  innerSlot.value.push(newBlock)
  emitUpdate()
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

function launchBlock(index, block, position) {
  innerSlot.value.splice(position == 'top' ? index : index + 1, 0, block)
  emitUpdate()
}

const focusedIndexes = ref({})

</script>

<template>
  <div
    class="CmsSlotEditor"
    :class="{'CmsSlotEditor--dragging': isDragging}"
  >
    <draggable
      v-model="innerSlot"
      :group="groupName"
      item-key="id"
      handle=".Block__drag-handle"
      :animation="111"
      :empty-insert-threshold="0"
      :swap-threshold="0.5"
      :inverted-swap-threshold="1"
      direction="vertical"

      @update:modelValue="onDraggableUpdate"
      @start="onDraggableStart()"
      @end="onDraggableEnd()"
    >
      <template #item="{element, index}">
        <div
          class="SlotBlock"
          :class="{'SlotBlock--focused': focusedIndexes[index]}"
        >
          <template v-if="showLauncher">
            <CmsBlockPicker
              v-for="position in ['bottom', 'top']"
              :key="position"

              :class="`SlotBlock__launcher SlotBlock__launcher--${position}`"
              :placement="position == 'bottom' ? 'bottom' : 'top'"
              @input="launchBlock(index, $event, position)"
              @update:open="focusedIndexes[index] = $event"
            >
              <template #trigger>
                <div class="LauncherFace">
                  <div class="LauncherFace__icon ui--noselect">
                    +
                  </div>
                </div>
              </template>
            </CmsBlockPicker>
          </template>

          <CmsBlockEditor
            class="CmsSlotEditor__item"
            :block="element"
            @update:block="onEditorUpdate(index, $event)"
            @delete="deleteBlock(index)"
          />
        </div>
      </template>
    </draggable>

    <CmsBlockPicker
      v-if="showLauncher"
      class="LoneBlockPicker"
      @input="appendBlock"
    />
  </div>
</template>

<style lang="scss">
.SlotBlock {
  position: relative;

  &:hover {
    z-index: 2;
  }

  // Show/hide __launcher on hover
  & > &__launcher {
    transition: all var(--ui-duration-snap);
    opacity: 0;
    pointer-events: none;
  }

  &:hover > &__launcher,
  &--focused > &__launcher {
    opacity: 1;
    pointer-events: initial;
  }


  &__launcher {
    cursor: pointer;

    position: absolute;
    left: 0;
    right: 0;

    &--top {
      bottom: 100%;

      .LauncherFace::after {
        bottom: 0;
      }
    }

    &--bottom {
      top: 100%;
      z-index: 2;

      .LauncherFace::after {
        top: 0;
      }

    }
  }


  // Launcher face opacity on hover
  &__launcher {
    .LauncherFace {
      opacity: 0.33;
    }

    &:hover {
      .LauncherFace {
        opacity: 1;
      }
    }
  }



  .LauncherFace {
    display: flex;
    align-items: center;
    justify-content: center;

    height: 28px;

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;

      font-family: var(--ui-font-secondary);
      font-size: 16px;
      font-weight: 500;

      width: 18px;
      height: 18px;
      border-radius: 50%;
      background-color: #313131;
      color: #fff;
    }

    &:hover {
      &::after {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        right: 0;

        border-top: 2px solid var(--ui-color-primary);
        border-bottom: 2px solid var(--ui-color-primary);
        z-index: 2;
      }
    }

    &:hover .LauncherFace__icon {
      background-color: var(--ui-color-primary);
    }
  }
}


// Launcher arrow
.SlotBlock__launcher {
  --triangle-color: #313131;
  &:hover {
    --triangle-color: var(--ui-color-primary);
  }

  .LauncherFace::before {
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    margin-left: -6px;
  }

  &--top {
    .LauncherFace::before {
      // Triangle
      bottom: 0;

      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid var(--triangle-color);

      // margin-left: -7px;
    }
  }

  &--bottom {
    .LauncherFace::before {
      // Triangle
      top: 0;

      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 8px solid var(--triangle-color);

      // margin-left: -5px;
    }
  }
}


.CmsSlotEditor {
  & > div:first-child { // draggable container
    min-width: 100%;
    min-height: 24px;
  }

  &--dragging {
    // prevent dragging blocks into droppable elements (like editable texts or file uploads) present in the block
    .BlockScaffold__face {
      pointer-events: none;
    }
  }
}

.LoneBlockPicker {
  margin: 12px;
}
</style>