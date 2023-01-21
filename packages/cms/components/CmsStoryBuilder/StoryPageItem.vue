<script setup>
import { ref, watch } from 'vue'
import { UiItem, UiIcon, UiPopover } from '@/packages/ui'
import { getBlockActions } from '../../functions'

const props = defineProps({
  /*
  Block object (for the page.  i.e. {component: LayoutPage})
  */
  modelValue: {
    type: Object,
    required: true,
  },

  selected: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'delete', 'open-editor'])

const availableActions = getBlockActions(props.modelValue, { allowSource: true })

const innerBlock = ref()
watch(
  () => props.modelValue,
  (newValue) => innerBlock.value = newValue,
  { immediate: true },
)

function onClickAction(action) {
  emit('open-editor', action.id)
}
</script>

<template>
  <UiItem
    class="StoryPageItem"
    :class="{'StoryPageItem--selected': props.selected}"
    icon="mdi:drag-vertical"
    :text="innerBlock.title || innerBlock.hash || innerBlock.id"
    :subtext="`#${innerBlock.hash}`"
  >
    <template #actions>
      <UiPopover>
        <template #trigger>
          <UiIcon src="mdi:dots-vertical" />
        </template>
        <template #contents="{ close }">
          <div class="StoryPageItem__popover">
            <UiItem
              v-for="action in availableActions"
              :key="action.id"
              class="StoryPageItem__menuItem"
              :text="action.title"
              :icon="action.icon"
              @click="close(); onClickAction(action);"
            />
            <UiItem
              class="StoryPageItem__menuItem StoryPageItem__menuItem--delete"
              icon="mdi:close"
              text="Delete"
              @click="close(); emit('delete');"
            />
          </div>
        </template>
      </UiPopover>
    </template>
  </UiItem>
</template>


<style lang="scss">
.StoryPageItem {
  --ui-item-padding: 4px 12px;
  user-select: none;

  margin-bottom: 2rem;
  padding: 8px;
  border-radius: 6px;

  color: var(--ui-color-foreground);
  background-color: var(--ui-color-background);

  opacity: 0.5;

  border: 2px solid transparent;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  transition: all var(--ui-duration-snap);

  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }

  &--selected {
    border: 2px solid var(--ui-color-primary);
    opacity: 1;
  }

  & > .UiItem__icon {
    cursor: move;
    padding: 0 4px;
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