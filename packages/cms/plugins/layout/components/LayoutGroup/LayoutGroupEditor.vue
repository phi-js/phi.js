<script setup>
import { ref, watch } from 'vue'

import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* modelValue object */
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
  <CmsSlotEditor
    v-model:slot="pageSlot"
    :label="`to ${props.modelValue?.title || 'group'}`"

    class="LayoutGroupEditor LayoutGroup"
    :style="{
      display: modelValue.props.direction == 'row' ? 'flex' : 'block',
      flexDirection: modelValue.props.direction,
      flexWrap: 'wrap',
      alignItems: modelValue.props.alignItems,
      justifyContent: modelValue.props.justifyContent,
    }"
    :direction="modelValue.props.direction == 'row' ? 'horizontal' : 'vertical'"

    @update:slot="onSlotUpdate"
  />
</template>