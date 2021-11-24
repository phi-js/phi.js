<script setup>
import { ref, watch, computed, provide } from 'vue'
import { UiWindow, UiTabs, UiIcon, UiTab } from '/packages/ui/components'
import { VmStatement } from '/packages/vm/components'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'
import { getBlockSchema } from '../../../../functions'


const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block'])

const blockSchema = computed(() => getBlockSchema(props.block))
provide('$_vm_modelSchema', blockSchema)

const pageSlot = ref([])
watch(
  () => props.block?.slot,
  (newValue) => pageSlot.value = Array.isArray(newValue) ? newValue : [],
  { immediate: true },
)

function launchRow() {
  const newRow = {
    component: 'LayoutRow',
    slot: [
      {
        component: 'LayoutColumn',
        props: { flex: 1 },
        slot: [],
      },
    ],
  }

  pageSlot.value.push(newRow)
  emit('update:block', { ...props.block, slot: pageSlot })
}

function onSlotUpdate() {
  emit('update:block', { ...props.block, slot: pageSlot })
}

const isWindowOpen = ref(false)
</script>

<template>
  <div class="LayoutPageEditor">
    <div class="LayoutPageEditor__toolbar">
      <UiIcon
        class="ui--clickable"
        src="mdi:dots-vertical"
        style="margin-left: auto"
        @click="isWindowOpen = !isWindowOpen"
      />
    </div>

    <CmsSlotEditor
      v-model:slot="pageSlot"
      group-name="page-slot"
      @update:slot="onSlotUpdate"
    />

    <button
      type="button"
      @click="launchRow"
    >
      launch row
    </button>

    <UiWindow
      v-model:open="isWindowOpen"
      text="Page settings"
      icon="mdi:cog"
      class="PageEditor__window ui-theme-dark"
      name="page-settings"
    >
      <UiTabs>
        <UiTab
          text="Setup"
          icon="mdi:cog"
        >
          <VmStatement
            :model-value="block.setup"
            :default="{chain:[]}"
          />
        </UiTab>
        <UiTab
          text="Source"
          icon="mdi:cog"
        >
          <VmStatement :model-value="block" />
        </UiTab>
      </UiTabs>

      <template #footer="{ close }">
        <button
          type="button"
          class="ui-button --main"
          @click="close()"
        >
          Aceptar
        </button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="close()"
        >
          Cancelar
        </button>
      </template>
    </UiWindow>
  </div>
</template>