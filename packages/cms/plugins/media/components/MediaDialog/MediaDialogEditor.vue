<script setup>
import { ref } from 'vue'
import BlockScaffold from '../../../../components/CmsSlotEditor/Bloh.vue'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import { UiIcon } from '../../../../../ui'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block'])

const isVisible = ref(true)

</script>

<template>
  <BlockScaffold
    class="MediaDialogEditor"
    v-bind="$attrs"
    :block="props.block"
    style="margin: 8px 12px"
    @update:block="$emit('update:block', $event)"
  >
    <template #toolbar>
      <UiIcon
        style="width: 40px"
        :src="!isVisible ? 'mdi:unfold-more-horizontal' : 'mdi:unfold-less-horizontal'"
        @click="isVisible = !isVisible"
      />
    </template>

    <template #default>
      <CmsSlotEditor
        v-show="isVisible"
        :slot="props.block.slot"
        class="MediaDialogEditor__slot"
        group-name="dialog-slot"
        @update:slot="emit('update:block', {...props.block, slot: $event})"
      />
    </template>
  </BlockScaffold>
</template>

<style lang="scss">
.MediaDialogEditor {
  &__slot {
    background-color: var(--ui-color-background);
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
}
</style>