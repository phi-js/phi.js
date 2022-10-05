<script setup>
import { UiItem, UiPopover } from '@/packages/ui'
import { inject } from 'vue'
import { getBlockDefinition, getBlockActions } from '../../functions'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  selected: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['select', 'delete', 'open-editor', 'insert-sibling'])

const definition = getBlockDefinition(props.block)
const availableActions = getBlockActions(props.block, { allowSource: true })

function onClickBody(evt) {
  evt.stopPropagation()
  emit('select')
}


/* Find the chain of SlotItem parents */
const curSlotItem = inject('_cms_SlotItem', null)
const parent = curSlotItem?.parent
// const ancestry = []
// let curParent = parentSlotItem?.parent
// while (curParent.parent) {
//   curParent = curParent.parent
//   ancestry.unshift(curParent)
// }
</script>

<template>
  <div
    class="Bloh"
    @click="onClickBody"
  >
    <div
      v-if="selected"
      class="Bloh__toolbar-container"
    >
      <UiItem
        v-if="parent"
        class="Bloh__parent"
        icon="mdi:chevron-up"
        :title="`Select parent: ${parent.innerBlock.value.title || parent.definition.title || parent.innerBlock.value.component}`"
        @click.stop.prevent="parent.selectBlock()"
      />

      <div class="Bloh__toolbar">
        <UiItem
          class="Bloh__headerItem"
          icon="mdi:dots-vertical"
          :text="props.block.title || definition.title || props.block.component"
        />
        <!-- custom toolbar component -->
        <slot name="toolbar" />

        <!-- Available actions dropdown -->
        <UiPopover>
          <template #trigger>
            <UiItem
              class="Bloh__menuBtn"
              icon="mdi:dots-vertical"
            />
          </template>
          <template #contents="{close}">
            <div class="Bloh__popover">
              <UiItem
                v-for="blockAction in availableActions"
                :key="blockAction.id"
                :icon="blockAction.icon"
                :text="blockAction.title"
                @click.stop="emit('open-editor', blockAction.id); close();"
              />
              <UiItem
                icon="mdi:close"
                text="Delete"
                @click="emit('delete'); close()"
              />
            </div>
          </template>
        </UiPopover>
      </div>

      <div
        class="Bloh__launcher Bloh__launcher--before"
        title="Insert block before"
        @click="emit('insert-sibling', 'before')"
      >
        +
      </div>
    </div>

    <slot />

    <div
      v-if="selected"
      class="Bloh__launcher Bloh__launcher--after"
      title="Insert block after"
      @click="emit('insert-sibling', 'after')"
    >
      +
    </div>
  </div>
</template>

<style lang="scss">
.Bloh {
  position: relative;

  &__toolbar-container {
    position: absolute;
    bottom: 100%;
    z-index: 1;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  &__toolbar {
    --ui-item-padding: 8px 12px;

    background: #333;
    color: #eee;
    border-radius: 4px;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    user-select: none;
  }

  &__headerItem {
    cursor: move;

    &:hover {
      background-color: rgba(255,255,255, 0.1);
    }
  }


  &__menuBtn {
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }

  &__popover {
    --ui-item-padding: 8px 12px;
    user-select: none;

    .UiItem {
      cursor: pointer;

      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }

  &__parent {
    --ui-item-padding: 12px;
    background-color: #777;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    color: #eee;

    height: 32px;

    opacity: 0.9;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }

  &__launcher {
    &--after {
      position: absolute;
      bottom: calc(-0.5rem - 3px);
      left: 50%;
      margin-left: -0.5rem;
      z-index: 1;
    }

    display: flex;
    align-items: center;
    justify-content: center;

    width: 1rem;
    height: 1rem;

    border-radius: 50%;
    background-color: #666;
    color: #eee;
    font-weight: bold;

    cursor: pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }

}
</style>