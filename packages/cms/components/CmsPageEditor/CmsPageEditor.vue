<script setup>
import { ref, watch, provide, computed } from 'vue'
import pageHelper from '../../helpers/Page.js'
import { CmsBlockEditor } from '../CmsBlockEditor'
import PageLayoutEditor from './PageLayoutEditor.vue'
import { VmStatement } from '../../../vm/components'
import { UiWindow, UiIcon, UiTabs, UiTab } from '../../../ui/index.js'
import { useHistory } from '/packages/ui/helpers'

const props = defineProps({
  page: {
    type: Object,
    required: false,
    default: null,
  },

  settings: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  modelSchema: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:page'])

provide('$_cms_settings', computed(() => props.settings))

const innerPage = ref(null)
watch(
  () => props.page,
  (newValue) => {
    innerPage.value = pageHelper.sanitizePage(newValue)
  },
  { immediate: true, deep: true },
)

function cancel() {
  innerPage.value = pageHelper.sanitizePage(props.page)
  return true
}

const { push, hasUndo, hasRedo, undo, redo } = useHistory(innerPage, (storedValue) => {
  innerPage.value = storedValue
  emitUpdatePage()
})

function emitUpdatePage() {
  push(innerPage.value)
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
    <div class="CmsPageEditor__toolbar ui-toolbar --wide --light">
      <slot name="toolbar" />
      <UiIcon
        class="ui--clickable ui--padded"
        :class="{'ui-disabled': !hasUndo}"
        title="Deshacer"
        src="mdi:undo"
        @click="undo()"
      />
      <UiIcon
        class="ui--clickable ui--padded"
        :class="{'ui-disabled': !hasRedo}"
        title="Rehacer"
        src="mdi:redo"
        @click="redo()"
      />

      <UiIcon
        class="ui--clickable"
        src="mdi:dots-vertical"
        style="margin-left: auto"
        @click="isWindowOpen = !isWindowOpen"
      />
    </div>

    <slot name="header" />

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
      class="PageEditor__window"
    >
      <UiTabs>
        <UiTab
          text="Setup"
          icon="mdi:cog"
        >
          <VmStatement
            v-model="innerPage.setup"
            :default="{chain:[]}"
          />
        </UiTab>
        <UiTab
          text="Source"
          icon="mdi:cog"
        >
          <VmStatement v-model="innerPage" />
        </UiTab>
      </UiTabs>

      <template #footer="{ close }">
        <button
          type="button"
          class="ui-button --main"
          @click="emitUpdatePage(); close()"
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
  </div>
</template>

<style lang="scss">
.PageEditor__window {
  .UiTabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    &__contents {
      flex: 1;
    }

    .VmStatement {
      --ui-radius: 0;
      width: 100%;
      height: 100%;

      .ui__input {
        background-color: var(--ui-color-bg-1);
        color: var(--ui-color-fg);
      }
    }
  }
}
</style>