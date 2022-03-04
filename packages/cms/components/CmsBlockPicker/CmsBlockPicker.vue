<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, nextTick } from 'vue'
import PickerContents from './PickerContents.vue'
import { UiItem, UiPopover } from '@/packages/ui/components'

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: ''
  },
  subtext: {
    type: String,
    required: false,
    default: ''
  },
  icon: {
    type: String,
    required: false,
    default: 'mdi:plus'
  },

  placement: {
    type: String,
    required: false,
    default: 'bottom', // top | bottom
  },
})

const emit = defineEmits(['input', 'update:open'])

const isOpen = ref(false)
const isHovered = ref(false)

const refPickerContents = ref()
async function onPopoverOpen() {
  await nextTick()
  if (!refPickerContents.value) {
    return
  }
  refPickerContents.value.focus()
}
</script>

<template>
  <div
    :class="[
      'CmsBlockPicker',
      `CmsBlockPicker--${props.placement}`,
      {
        'CmsBlockPicker--hovered': isHovered || isOpen,
        'CmsBlockPicker--open': isOpen,
        'CmsBlockPicker--closed': !isOpen
      },
      $attrs.class
    ]"
  >
    <UiPopover
      v-model:open="isOpen"
      class="CmsBlockPicker__popover"
      placement="bottom-end"
      @update:open="emit('update:open', isOpen)"
      @open="onPopoverOpen"
      trigger="manual"
    >
      <template #trigger="{ toggle }">
        <UiItem
          class="CmsBlockPicker__item"
          :icon="props.icon"
          :text="props.text"
          @mouseenter="isHovered = true"
          @mouseleave="isHovered = false"
          @click="toggle()"
        />
      </template>

      <template #contents="{ close }">
        <PickerContents
          ref="refPickerContents"
          class="CmsBlockPicker__contents"
          @input="emit('input', $event); close()"
        />
      </template>
    </UiPopover>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &__popover {
    .UiPopover__trigger {
      display: inline-block; // fix popover positioning around trigger
    }
  }

  &__contents {
    width: 488px;
    min-height: 400px;
  }

  &__item {
    user-select: none;

    --ui-item-padding: 8px 12px;
    background-color: #818181;
    color: #ddd;
    font-size: 14px;
    font-weight: bold;

    border-radius: 5px;
    transition: all var(--ui-duration-snap);
    cursor: pointer;

    display: inline-flex;

    .UiItem__body {
      padding-left: 0;
      padding-right: 0;
      transition: all var(--ui-duration-snap);
    }

    .UiItem__text {
      overflow: hidden;
      text-overflow: clip;

      max-width: 0;
      padding-left: 0;
      padding-right: 0;

      transition: all var(--ui-duration-snap);
    }

    .CmsBlockPicker--open &,
    &:hover {
      // --ui-item-padding: 8px 12px;
      border-radius: 4px;
      background-color: #313131;

      .UiItem__body {
        padding: var(--ui-item-padding);
        padding-left: 0;
      }

      .UiItem__text {
        max-width: 156px;
        padding-left: initial;
        padding-right: initial;
      }
    }
  }
}

// Dashed "Ruler" on hover
.CmsBlockPicker {
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    border-bottom: 5px dashed var(--ui-color-primary);

    left: 0;
    right: 0;
    pointer-events: none;

    opacity: 0;
    transition: opacity var(--ui-duration-snap);
  }

  &--open,
  &--hovered {
    &::before {
      opacity: 1;
    }
  }

  // ruler position
  &--bottom {
    &::before {
      top: 0;
    }
  }

  &--top {
    &::before {
      bottom: 0;
    }
  }
}
</style>