<script setup>
import { ref, watch } from 'vue'

import UiVideoContainer from '@/packages/ui/components/UiVideoContainer/UiVideoContainer.vue'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const pageSlot = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    pageSlot.value = Array.isArray(newValue?.slot) ? newValue.slot : []
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:modelValue', { ...props.modelValue, slot: pageSlot })
}
</script>

<template>
  <UiVideoContainer
    class="MediaVideoContainerFace"
    v-bind="modelValue.props"
    is-loaded
  >
    <CmsSlotEditor
      v-model:slot="pageSlot"
      label="Add content over video"
      @update:slot="onSlotUpdate"
    />
  </UiVideoContainer>
</template>