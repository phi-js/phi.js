<script setup>
import BlockScaffold from '@/packages/cms/components/CmsBlockEditor/BlockScaffold.vue'
import CmsSlotEditor from '@/packages/cms/components/CmsSlotEditor/CmsSlotEditor.vue'
import { UiButton } from '@/packages/ui'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block'])
</script>

<template>
  <BlockScaffold
    class="DbRecordFormEditor"
    v-bind="$attrs"
    :block="props.block"
    @update:block="$emit('update:block', $event)"
  >
    <template #default>
      <CmsSlotEditor
        :slot="props.block.slot"
        class="DbRecordFormEditor__slot"
        group-name="dialog-slot"
        :show-launcher="true"
        @update:slot="emit('update:block', {...props.block, slot: $event})"
      />
      <footer style="pointer-events: none; opacity: 0.8;">
        <UiButton
          label="Guardar"
        />
        <UiButton
          label="Cancelar"
          class="UiButton--cancel"
        />
      </footer>
    </template>
  </BlockScaffold>
</template>