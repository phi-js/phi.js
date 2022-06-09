<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, nextTick, watch } from 'vue'
import PickerContents from './PickerContents.vue'
import { UiPopover } from '@/packages/ui/components'

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: '',
  },

  subtext: {
    type: String,
    required: false,
    default: '',
  },

  icon: {
    type: String,
    required: false,
    default: 'mdi:plus',
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

const emit = defineEmits(['input', 'update:open'])

const isOpen = ref()
watch(
  () => props.open,
  (v) => isOpen.value = v,
  { immediate: true },
)

const refPickerContents = ref()
async function onPopoverOpen() {
  if (!refPickerContents.value) {
    return
  }
  await nextTick()
  refPickerContents.value.querySelector('input')?.focus?.()
}
</script>

<template>
  <div
    :class="[
      'CmsBlockPicker',
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
      placement="bottom"
      trigger="manual"
      @update:open="emit('update:open', $event)"
      @open="onPopoverOpen"
    >
      <template #trigger="{ toggle }">
        <slot
          name="trigger"
          :toggle="toggle"
        />
      </template>

      <template #contents="{ close }">
        <div ref="refPickerContents">
          <PickerContents
            class="CmsBlockPicker__contents"
            @input="emit('input', $event); close()"
          />
        </div>
      </template>
    </UiPopover>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &__contents {
    width: 488px;
    min-height: 400px;
  }
}
</style>