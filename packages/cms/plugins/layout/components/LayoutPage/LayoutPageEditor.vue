<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiWindow, UiTabs, UiItem, UiTab } from '/packages/ui/components'
import { VmStatement } from '/packages/vm/components'
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

const isWindowOpen = ref(false)

function accept() {
  emit('update:block', JSON.parse(JSON.stringify(innerBlock.value)))
  return true
}

function cancel() {
  innerBlock.value = JSON.parse(JSON.stringify(props.block))
  return true
}

const blockSchema = computed(() => getBlockSchema(props.block))
provide('$_vm_modelSchema', blockSchema)
</script>

<template>
  <div class="LayoutPageEditor">
    <div class="LayoutPageEditor__toolbar">
      <UiItem
        class="LayoutPageEditor__item"
        text="Mi página"
        icon="mdi:cog"
        @click="isWindowOpen = !isWindowOpen"
      />
      <slot name="toolbar" />
    </div>

    <div class="LayoutPageEditor__body">
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

    <UiWindow
      v-model:open="isWindowOpen"
      text="Page settings"
      icon="mdi:cog"
      class="LayoutPageEditor__window ui-theme-dark"
      name="page-settings"
    >
      <UiTabs>
        <UiTab
          text="Startup"
          icon="mdi:cog"
        >
          <VmStatement
            v-model="innerBlock.setup"
            :default="{chain:[]}"
          />
        </UiTab>
        <UiTab
          text="Source"
          icon="mdi:code-json"
        >
          <VmStatement v-model="innerBlock" />
        </UiTab>
      </UiTabs>

      <template #footer="{ close }">
        <button
          type="button"
          class="ui-button --main"
          @click="accept() && close()"
        >
          Aceptar
        </button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="cancel() && close()"
        >
          Cancelar
        </button>
      </template>
    </UiWindow>

    <div class="LayoutPageEditor__wedge" />
  </div>
</template>