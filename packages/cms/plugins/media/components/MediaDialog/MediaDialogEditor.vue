<script setup>
import { ref } from 'vue'
import BlockScaffold from '../../../../components/CmsBlockEditor/BlockScaffold.vue'
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
        class="ui--clickable"
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
        :show-launcher="true"
        @update:slot="emit('update:block', {...props.block, slot: $event})"
      />
    </template>
  </BlockScaffold>
</template>

<style lang="scss">
.MediaDialogEditor {
  &__slot {
    background: #fff;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
}
</style>