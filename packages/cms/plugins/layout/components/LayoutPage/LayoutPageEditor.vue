<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiItem } from '@/packages/ui/components'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import { getBlockSchema, getCssObjectAttributes } from '../../../../functions'

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
  (newValue) => {
    pageSlot.value = Array.isArray(newValue?.slot) ? newValue.slot : []
  },
  { immediate: true },
)

function launchRow() {
  pageSlot.value.push({
    component: 'LayoutRow',
    slot: [
      {
        component: 'LayoutColumn',
        props: { flex: 1 },
        slot: [],
      },
    ],
  })
  emit('update:block', { ...props.block, slot: pageSlot })
}

function onSlotUpdate() {
  emit('update:block', { ...props.block, slot: pageSlot })
}

const blockSchema = computed(() => getBlockSchema(props.block))
provide('$_vm_modelSchema', blockSchema)

const cssAttributes = computed(() => getCssObjectAttributes(props.block?.css))

</script>

<template>
  <div
    class="LayoutPageEditor"
    v-bind="cssAttributes"
  >
    <CmsSlotEditor
      v-model:slot="pageSlot"
      class="LayoutPage"
      group-name="page-slot"
      @update:slot="onSlotUpdate"
    />

    <UiItem
      class="RowLauncher"
      text="Add row"
      icon="mdi:plus"
      @click="launchRow"
    />
  </div>
</template>