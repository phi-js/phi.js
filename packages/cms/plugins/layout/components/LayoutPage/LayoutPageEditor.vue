<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiItem } from '@/packages/ui/components'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import { getBlockSchema } from '../../../../functions'

// Page editor theme
import '../../style/index.scss'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block'])

const pageSlot = ref([])
const innerBlock = ref(null)
watch(
  () => props.block,
  (newValue) => {
    innerBlock.value = JSON.parse(JSON.stringify(newValue))
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
</script>

<template>
  <div class="LayoutPageEditor">
    <CmsSlotEditor
      v-model:slot="pageSlot"
      group-name="page-slot"
      @update:slot="onSlotUpdate"
    />

    <UiItem
      class="RowLauncher"
      text="Add section"
      icon="mdi:plus"
      @click="launchRow"
    />
  </div>
</template>