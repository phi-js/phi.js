<script setup>
import { UiItemFinder } from '@/packages/ui'
import { useAvailableBlocks } from '../../functions/usePlugin'

const emit = defineEmits(['input'])

// Raw array of all available blocks
// (All those without disabled:true in their definition i.e. LayoutPage)
function launchBlock(blockDefinition) {
  emit('input', blockDefinition)
}

const availableBlocks = useAvailableBlocks()

</script>

<template>
  <UiItemFinder
    class="PickerContents"
    :items="availableBlocks"
    @select-item="launchBlock"
  >
    <template #body>
      <slot name="body" />
    </template>
  </UiItemFinder>
</template>

<style lang="scss">
.PickerContents {
  display: flex;
  flex-direction: column;

  .UiItemFinder__body {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
    & > * {
      margin-bottom: 8px;
    }
  }
}
</style>