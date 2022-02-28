<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, nextTick } from 'vue'
import PickerContents from './PickerContents.vue'
import { UiItem, UiPopover } from '@/packages/ui/components'

const props = defineProps({
  placement: {
    type: String,
    required: false,
    default: 'bottom-start',
  },
})

const emit = defineEmits(['input', 'update:open'])

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
    :class="[
      'CmsBlockPicker',
      `CmsBlockPicker--placement-${props.placement}`,
      {
        'CmsBlockPicker--open': isOpen,
        'CmsBlockPicker--closed': !isOpen
      },
      $attrs.class
    ]"
  >
    <UiPopover
      v-model:open="isOpen"
      class="CmsBlockPicker__popover"
      :placement="props.placement"
      @update:open="emit('update:open', isOpen)"
      @open="onPopoverOpen"
    >
      <template #trigger="slotData">
        <slot
          name="trigger"
          v-bind="slotData"
        >
          <div class="CmsBlockPicker__trigger ui--clickable">
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
          @input="emit('input', $event); close()"
        />
      </template>
    </UiPopover>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &--placement-bottom-start &__popover {
    .tippy-arrow {
      transform: translate(14px, 0) !important;
    }
  }

  &__tooltip {
    width: 490px;
    min-height: 300px;
  }

  &__trigger {
    background-color: rgba(0, 0, 0, 0.03);
    color: rgba(0, 0, 0, 0.7);
  }
}
</style>