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