<script setup>
import { ref, watch, computed } from 'vue'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import { getCssObjectAttributes } from '../../../../functions'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
  // block: {
  //   type: Object,
  //   required: true,
  // },
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

const cssAttributes = computed(() => getCssObjectAttributes(props.modelValue?.css, props.modelValue))
</script>

<template>
  <CmsSlotEditor
    v-bind="cssAttributes"
    v-model:slot="pageSlot"
    class="LayoutGroupEditor"
    group-name="cms-slot"
    :direction="props.modelValue?.props?.direction || 'column'"
    :style="{
      display: props.modelValue?.props?.direction == 'row' ? 'flex' : 'block',
      flexDirection: props.modelValue?.props?.direction || 'column',
      flexWrap: 'wrap',
    }"
    @update:slot="onSlotUpdate"
  />
</template>

<style lang="scss">
.LayoutGroupEditor {
  padding-bottom: 22px; // make bottom room for nested editors

  & > * {
    flex: 1;
  }
}

// Dashed outline
.BlockScaffold.BlockScaffold--LayoutGroup {
  &::before {
    --outline-offset: -12px;
    bottom: -2px !important;
  }
}

.BlockScaffold .BlockScaffold.BlockScaffold--LayoutGroup::before {
  --outline-offset: -7px;
  bottom: -2px !important;
}

.BlockScaffold .BlockScaffold .BlockScaffold.BlockScaffold--LayoutGroup::before {
  --outline-offset: -5px;
  bottom: -2px !important;
}

</style>