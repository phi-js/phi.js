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
  <div class="LayoutGroupEditor">
    <div class="LayoutGroupEditor__header">
      {{ props.modelValue?.title }}
    </div>
    <CmsSlotEditor
      v-model:slot="pageSlot"
      :style="cssVariables"
      :direction="props.modelValue?.props?.direction || 'column'"
      :label="`Add content to ${props.modelValue?.title || 'group'}`"
      @update:slot="onSlotUpdate"
    />
  </div>
</template>

<style lang="scss">
.LayoutGroupEditor {
  .CmsSlotEditor__draggable {
    align-items: var(--layout-group-align-items);
    justify-content: var(--layout-group-justify-content);
  }

  // border: 1px solid var(--ui-color-primary);
  // padding: 8px;
  // margin-left: -8px;
  // margin-right: -8px;

  padding-top: 18px;

  &__header {
    font-size: 9px;
    background-color: #777;
    color: #fff;
    padding: 1px 4px;

    position: absolute;
    top: 0;
    // bottom: 100%;
    left: 0;
    right: 0;

    cursor: pointer;
    user-select: none;
  }
}
</style>