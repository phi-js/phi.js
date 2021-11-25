<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, nextTick } from 'vue'
import PickerContents from './PickerContents.vue'
import { UiItem, UiPopover } from '/packages/ui/components'
const isOpen = ref(false)

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
    class="CmsBlockPicker"
    :class="{'CmsBlockPicker--open': isOpen, 'CmsBlockPicker--closed': !isOpen}"
  >
    <UiPopover
      v-model:open="isOpen"
      class="CmsBlockPicker__popover"
      placement="bottom-start"
      @open="onPopoverOpen"
    >
      <template #trigger="slotData">
        <slot
          name="trigger"
          v-bind="slotData"
        >
          <div class="CmsBlockPicker__trigger ui--clickable ui--noselect">
            <UiItem
              icon="mdi:plus"
              text="Agregar contenido"
            />
          </div>
        </slot>
      </template>

      <template #contents="{close}">
        <PickerContents
          ref="refPickerContents"
          class="CmsBlockPicker__tooltip"
          v-bind="$attrs"
          @input="close()"
        />
      </template>
    </UiPopover>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &__popover {
    .tippy-arrow {
      transform: translate(14px, 0) !important;
    }
  }

  &__tooltip {
    width: 490px;
    min-height: 300px;
  }

  &__trigger {
    border-radius: var(--ui-radius);
    background-color: rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>