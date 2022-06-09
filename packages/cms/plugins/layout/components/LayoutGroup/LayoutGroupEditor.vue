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
    @update:slot="onSlotUpdate"
  />
</template>

<style lang="scss">
.LayoutGroupEditor {
  padding-bottom: 22px; // make bottom room for nested editors
}

// .LayoutGroupEditor {
.BlockScaffold.BlockScaffold--LayoutGroup > .BlockScaffold__face {
  padding-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
}

.BlockScaffold.BlockScaffold--LayoutGroup {
  margin-top: -6px;
  margin-left: -6px;
  margin-right: -6px;
}
</style>