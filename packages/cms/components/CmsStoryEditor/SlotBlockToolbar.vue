<script setup>
import { inject } from 'vue'
import { UiItem, UiPopover } from '@/packages/ui'
import { onDragstart, onDragend } from './dragdrop'

defineProps({
  /*
  A VUE instance of SlotBlock
  */
  instance: {
    type: Object,
    required: true,
  },
})

const CmsStoryEditor = inject('_cms_CmsStoryEditor')

</script>

<template>
  <div class="SlotBlockToolbar">
    <div class="SlotBlockToolbar__toolbar">
      <UiItem
        icon="mdi:drag"
        :text="instance.block.title || instance.definition.title || instance.block.component"

        draggable="true"
        @dragstart="onDragstart($event, instance)"
        @dragend="onDragend($event)"
      />

      <Component
        :is="instance.toolbarComponent"
        v-if="instance.toolbarComponent"
      />

      <UiPopover>
        <template #trigger>
          <UiItem
            class="SlotBlockToolbar__menuBtn"
            icon="mdi:dots-vertical"
          />
        </template>
        <template #contents="{close}">
          <div class="SlotBlockToolbar__popover">
            <UiItem
              v-for="blockAction in instance.availableActions"
              :key="blockAction.id"
              :icon="blockAction.icon"
              :text="blockAction.title"
              @click="CmsStoryEditor.openBlockWindow(instance, blockAction.id); close();"
            />
            <UiItem
              icon="mdi:close"
              text="Delete"
              @click="instance.deleteBlock"
            />
          </div>
        </template>
      </UiPopover>
    </div>
  </div>
</template>

<style lang="scss">
.SlotBlockToolbar {
  &__toolbar {
    --ui-item-padding: 8px 12px;

    height: 40px;
    display: flex;
    align-items: center;
    color: #ffffff80;
    background-color: #313131;
    border-radius: 5px;

    font-size: 0.9em;
    font-weight: bold;

    white-space: nowrap;
    user-select: none;

    & > .UiItem {
      cursor: move;
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
}
</style>