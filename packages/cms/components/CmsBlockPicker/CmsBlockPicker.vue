<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch } from 'vue'
import { UiDialog, UiItemFinder } from '@/packages/ui'
import { useAvailableBlocks } from '../../functions/usePlugin'

const availableBlocks = useAvailableBlocks()

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
let hasPushedState = false

watch(
  () => props.open,
  (v) => {
    isOpen.value = v

    // Close on BACK button
    if (isOpen.value) {
      // register cancel listeners
      history.pushState({ open: true }, '')
      window.addEventListener('popstate', onPopState)
      hasPushedState = true
    } else {
      // unregister cancel listeners
      window.removeEventListener('popstate', onPopState)
      if (hasPushedState) {
        history.go(-1)
        hasPushedState = false
      }
    }

  },
  { immediate: true },
)

function setOpen(bool) {
  if (isOpen.value === bool) {
    return
  }
  emit('update:open', bool)
}

function onPopState() {
  hasPushedState = false
  setOpen(false)
}
</script>

<template>
  <div
    :class="[
      'CmsBlockPicker',
      {
        'CmsBlockPicker--open': isOpen,
        'CmsBlockPicker--closed': !isOpen,
      },
      $attrs.class
    ]"
  >
    <div class="CmsBlockPicker__trigger">
      <slot name="trigger" />
    </div>

    <UiDialog
      v-slot="{ close }"
      v-model:open="isOpen"
      show-close-button
      @update:open="emit('update:open', $event)"
    >
      <UiItemFinder
        class="PickerContents"
        :items="availableBlocks"
        @select-item="emit('input', $event); close()"
      >
        <template #body>
          <slot
            name="body"
            :close="close"
          />
        </template>
      </UiItemFinder>
    </UiDialog>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  dialog {
    height: 800px;
    max-height: 80vh;
    margin: 5vh auto;
  }
}
</style>