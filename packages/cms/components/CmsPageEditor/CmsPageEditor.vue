<script setup>
import { ref, watch, provide, computed } from 'vue'
import pageHelper from '../../helpers/Page.js'
import { CmsBlockEditor } from '../CmsBlockEditor'
import PageLayoutEditor from './PageLayoutEditor.vue'
import { VmStatement } from '../../../vm/components'
import { UiWindow, UiIcon, UiTabs, UiTab } from '../../../ui/index.js'

const props = defineProps({
  page: {
    type: Object,
    required: false,
    default: null,
  },

  modelSchema: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:page'])

const innerPage = ref(null)
watch(
  () => props.page,
  (newValue) => innerPage.value = pageHelper.sanitizePage(newValue),
  { immediate: true, deep: true },
)

function emitUpdatePage() {
  emit('update:page', innerPage.value)
}

const pageSchema = computed(() => pageHelper.getDataSchema(innerPage.value))
const combinedSchema = computed(() => ({
  type: 'object',
  properties: {
    ...(props.modelSchema?.properties || null),
    ...(pageSchema.value?.properties || null),
  },
}))
provide('$_vm_modelSchema', combinedSchema)

const isWindowOpen = ref(false)
</script>

<template>
  <div class="CmsPageEditor">
    <div class="CmsPageEditor__toolbar ui-toolbar --wide">
      <slot name="toolbar" />
      <UiIcon
        class="ui-clickable"
        src="mdi:cog"
        style="margin-left: auto"
        @click="isWindowOpen = !isWindowOpen"
      />
    </div>

    <PageLayoutEditor
      v-model:page="innerPage"
      class="CmsPageEditor__layout"
      @update:page="emitUpdatePage"
    >
      <template #block="slotData">
        <CmsBlockEditor
          v-model:block="innerPage
            .sections[slotData.sectionIndex]
            .rows[slotData.rowIndex]
            .columns[slotData.colIndex]
            .blocks[slotData.blockIndex]"

          @update:block="emitUpdatePage"
          @delete="slotData.deleteBlock"
        />
      </template>
    </PageLayoutEditor>

    <UiWindow
      v-model:open="isWindowOpen"
      text="Page settings"
      icon="mdi:cog"
    >
      <UiTabs>
        <UiTab
          text="Setup"
          icon="mdi:cog"
        >
          <VmStatement v-model="innerPage.setup" />
        </UiTab>
      </UiTabs>

      <template #footer="{ hide }">
        <button
          type="button"
          class="ui-button --main"
          @click="emitUpdatePage(); hide()"
        >
          Aceptar
        </button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="hide()"
        >
          Cancelar
        </button>
      </template>
    </UiWindow>
  </div>
</template>