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
      display: 'flex',
      flexDirection: props.modelValue?.props?.direction || 'column',
      xxxflexWrap: 'wrap',
    }"
    @update:slot="onSlotUpdate"
  />
</template>

<style lang="scss">
// make bottom room for nested editors
.LayoutGroupEditor {
  padding-bottom: 30px;
}

.LayoutGroupEditor > * {
  flex: 1;
}

// Better for positioning elements and understading group nesting in the editor
// ... but fucks up pixel-perfect wyiswyg
// .BlockScaffold--LayoutGroup {
//   padding: 4px 4px 20px 4px;
// }

// Dashed outline
.BlockScaffold.BlockScaffold--LayoutGroup {
  &::before {
    --outline-offset: -6px;
    z-index: 0;

    // border: 1px dashed #777;
    // z-index: 0;
  }

  // &:hover::before {
  //   border: 1px solid var(--ui-color-primary);
  //   opacity: 1;
  // }
}
</style>