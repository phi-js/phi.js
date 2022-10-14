<script setup>
import { UiItem, UiIcon, UiPopover } from '@/packages/ui'
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

  direction: {
    type: String,
    required: false,
    default: 'vertical', // vertical | horizontal
  },
})

const emit = defineEmits(['select', 'delete', 'open-editor', 'insert-sibling'])

const definition = getBlockDefinition(props.block)
const availableActions = getBlockActions(props.block, { allowSource: true })

const shortcuts = availableActions.filter((a) => a.hasData)

function emitSelect(evt) {
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
    :class="[
      'Bloh--'+props.block.component,
      `Bloh--${direction}`,
      {'Bloh--selected': props.selected},
      props.block.props?.class,
    ]"
    :style="props.block.props?.style"
    tabindex="0"
    @click="emitSelect"
    @focus="emitSelect"
  >
    <div class="Bloh__toolbar-container">
      <div class="Bloh__label">
        {{ props.block.title || definition?.title || props.block.component }}
      </div>

      <template v-if="selected">
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
            icon="mdi:drag"
            :text="$slots.toolbar ? '' : props.block.title || definition?.title || props.block.component"
          />
          <!-- custom toolbar component -->
          <slot name="toolbar" />

          <div class="Bloh__separator" />

          <!-- shortcut icons -->
          <UiIcon
            v-for="action in shortcuts"
            :key="action.id"
            :src="action.icon"
            class="Bloh__shortcut"
            @click.stop="emit('open-editor', action.id)"
          />

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
                  v-for="action in availableActions"
                  :key="action.id"
                  :icon="action.icon"
                  :text="action.title"
                  @click.stop="emit('open-editor', action.id); close();"
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
          v-if="direction == 'vertical'"
          class="Bloh__launcher Bloh__launcher--before"
          title="Insert block before"
          @click="emit('insert-sibling', 'before')"
        >
          +
        </div>
      </template>
    </div>

    <slot />

    <div
      v-if="selected && direction == 'horizontal'"
      class="Bloh__launcher Bloh__launcher--before"
      title="Insert block before"
      @click="emit('insert-sibling', 'before')"
    >
      +
    </div>

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
  outline: none;

  // --outline-offset: -5px; // causes body horizontal scroll

  --outline-offset: 0;
  z-index: 1; // messes up dragstart from toolbar (in html blocks only ???)

  // "outline"
  &::after {
    content: '';
    pointer-events: none;

    border-radius: 4px;
    border: 1px solid #999;

    position: absolute;
    display: block;
    top: var(--outline-offset);
    left: var(--outline-offset);
    right: var(--outline-offset);
    bottom: var(--outline-offset);

    transition: all 222ms;
    opacity: 0;

    //reset
    text-decoration: none;
    text-shadow: none;
    color: inherit;
  }

  &--selected {
    z-index: 2; // messes up dragstart from toolbar (in html blocks only ???)

    .Bloh__label {
      display: none;
    }

    &::after {
      border-color: var(--ui-color-primary);
    }
  }

  &--selected::after,
  &:hover::after {
    opacity: 1;
    border-color: var(--ui-color-primary);
  }


  &__toolbar-container {
    position: absolute;
    left: 0;
    bottom: 100%;
    z-index: 1;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    font-size: 1rem;
  }

  &__label {
    user-select: none;
    pointer-events: none;

    transition: all 222ms;
    opacity: 0;

    font-size: 12px;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;

    position: relative;
    left: 2px;
    background-color: var(--ui-color-background);
    // color: var(--ui-color-foreground, #fff);
    color: var(--ui-color-primary, #fff);

    //reset
    text-decoration: none;
    text-shadow: none;
  }

  &:hover > &__toolbar-container > &__label {
    opacity: 1;
  }

  &__toolbar {
    --ui-color-hover: rgba(255,255,255, 0.08);
    --ui-item-padding: 8px 12px;

    background: #333;
    color: #eee;
    border-radius: 4px;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    user-select: none;
    z-index: 1;

    overflow-x: auto;
    max-width: calc(100vw - 72px);

    .UiForm {
      .UiInput {
        &__element {
          background: rgba(255,255,255,0.08);
          min-width: 0 !important;
          max-width: 5rem;
        }
      }
    }
  }

  &__headerItem {
    cursor: move;
    font-size: 0.9rem;
    font-weight: bold;
    color: #ffffffcc;

    &:hover {
      background-color: rgba(255,255,255, 0.1);
    }
  }

  &__separator {
    align-self: stretch;
    border-right: 1px solid #ffffff22;
    border-left: 1px solid #00000055;
  }

  &__shortcut {
    align-self: stretch;
    width: 36px;

    color: rgba(255,255,255, 0.7);

    cursor: pointer;
    &:hover {
      color: #fff;
      background-color: var(--ui-color-hover);
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
    font-size: 0.9rem;

    .UiItem {
      cursor: pointer;
      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }

  &__parent {
    align-self: flex-start;

    --ui-item-padding: 4px 8px;
    background-color: #999;
    color: #eee;
    border-radius: 4px;
    left: 4px;
    margin-left: -15px;
    cursor: pointer;
    &:hover {
      background-color: #888;
    }
  }

  &__launcher {
    &--before {
      margin-left: 3px;
    }

    &--after {
      position: absolute;
      bottom: -15px;
      left: 50%;
      margin-left: -14px;
      z-index: 1;
    }

    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;

    width: 28px;
    height: 20px;

    border-radius: 4px;
    background-color: #333;
    color: #eee;
    font-weight: bold;

    cursor: pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}


// Sibling launcher positions depending on block "direction" props
.Bloh--horizontal {

  & > .Bloh__launcher--before {
    position: absolute;
    top: 50%;
    left: -18px;
    margin-top: -10px;
    z-index: 1;
  }

  & > .Bloh__launcher--after {
    top: 50%;
    right: -13px;
    bottom: auto;
    left: auto;
    margin-left: auto;
    margin-top: -10px;
  }
}


// Block-specific stylings
.Bloh--LayoutGroup {
  padding: 6px;
  // margin: 0 -3px; // causes horizontal overscroll on body
  margin-bottom: 6px;

  .Bloh--LayoutGroup {
    margin-top: 16px;
  }

  &:hover > .Bloh__toolbar-container > .Bloh__label {
    color: var(--ui-color-primary);
  }

  & > .Bloh__toolbar-container > .Bloh__label {
    opacity: 1;
    top: 3px;
    color: #999;
  }

  &::after {
    opacity: 0.3;
  }

  & + .Bloh--LayoutGroup {
    margin-top: 18px;
  }

  & > .LayoutGroupEditor > .CmsSlotEditor__footer {
    display: none;
  }

  & > .LayoutGroupEditor.CmsSlotEditor--empty > .CmsSlotEditor__footer,
  &.Bloh--selected > .LayoutGroupEditor > .CmsSlotEditor__footer {
    display: block;
  }
}
</style>