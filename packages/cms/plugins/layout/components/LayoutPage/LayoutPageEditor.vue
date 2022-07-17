<script setup>
import { ref, watch, computed } from 'vue'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import { getCssObjectAttributes } from '../../../../functions'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block'])

const pageSlot = ref([])
watch(
  () => props.block,
  (newValue) => pageSlot.value = Array.isArray(newValue?.slot) ? newValue.slot : [],
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:block', { ...props.block, slot: pageSlot })
}

const cssAttributes = computed(() => getCssObjectAttributes(props.block?.css, props.block))
</script>

<template>
  <div class="LayoutPageEditor LayoutPage">
    <CmsSlotEditor
      v-bind="cssAttributes"
      v-model:slot="pageSlot"
      class="LayoutPage__contents"
      @update:slot="onSlotUpdate"
    />
  </div>
</template>