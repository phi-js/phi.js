<script setup>
import { ref, watch, computed } from 'vue'
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

const cssVariables = computed(() => {
  return {
    '--layout-group-align-items': props.modelValue?.props?.alignItems,
    '--layout-group-justify-content': props.modelValue?.props?.justifyContent,
  }
})

</script>

<template>
  <CmsSlotEditor
    v-model:slot="pageSlot"
    :style="cssVariables"
    class="LayoutGroupEditor"
    :direction="props.modelValue?.props?.direction || 'column'"
    :label="`Add content to ${props.modelValue?.title || 'group'}`"
    @update:slot="onSlotUpdate"
  />
</template>

<style lang="scss">
.LayoutGroupEditor {
  .CmsSlotEditor__draggable {
    align-items: var(--layout-group-align-items);
    justify-content: var(--layout-group-justify-content);
  }
}
</style>