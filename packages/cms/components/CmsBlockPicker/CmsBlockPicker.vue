<script setup>
import { ref } from 'vue'
import PickerContents from './PickerContents.vue'
import { UiItem, UiPopover } from '/packages/ui/components'
const isOpen = ref(false)
</script>

<template>
  <div
    class="CmsBlockPicker"
    :class="{'CmsBlockPicker--open': isOpen, 'CmsBlockPicker--closed': !isOpen}"
  >
    <UiPopover
      v-model:open="isOpen"
      placement="bottom-start"
    >
      <template #trigger="slotData">
        <slot
          name="trigger"
          v-bind="slotData"
        >
          <div class="CmsBlockPicker__trigger ui-clickable">
            <UiItem
              class="trigger-item"
              icon="mdi:plus"
              text="Agregar contenido"
            />
          </div>
        </slot>
      </template>

      <template #contents="{close}">
        <div class="CmsBlockPicker__popover">
          <PickerContents
            v-bind="$attrs"
            @input="close()"
          />
        </div>
      </template>
    </UiPopover>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &__popover {
    max-width: 500px;
    min-height: 300px;
  }

  &__trigger {
    border: 2px dashed rgba(0, 0, 0, 0.1);
    border-radius: var(--ui-radius);

    .trigger-item {
      display: inline-flex;
      margin: auto;
    }
  }
}
</style>