<script setup>
import { ref, watch } from 'vue'
import { UiWindow, UiTabs, UiTab, UiItem } from '@/packages/ui/components'
import { VmStatement } from '@/packages/vm/components'
import BlockCssEditor from '../../../../components/CmsBlockEditor/BlockCssEditor.vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  currentTab: {
    type: [String, Boolean],
    required: false,
    default: null
  }
})

const emit = defineEmits(['update:block', 'accept', 'cancel', 'update:currentTab'])

const innerBlock = ref(null)
watch(
  () => props.block,
  (newValue) => innerBlock.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true },
)

function accept() {
  const copy = JSON.parse(JSON.stringify(innerBlock.value))
  emit('update:block', copy)
  emit('accept', copy)
  return true
}

function cancel() {
  innerBlock.value = JSON.parse(JSON.stringify(props.block))
  emit('update:block', innerBlock.value)
  emit('cancel')
  return true
}

const currentTab = ref()
watch(
  () => props.currentTab,
  (newTabValue) => currentTab.value = newTabValue === true ? 'actions' : newTabValue,
  { immediate: true }
)
</script>

<template>
  <UiWindow
    :open="!!props.currentTab"
    class="LayoutPageWindow"
    name="phi"
    @update:open="emit('update:currentTab', null)"
  >
    <template #header>
      <UiItem
        icon="mdi:pound"
        :text="innerBlock?.info?.text || 'Page settings'"
        class="ui--noselect"
      />
    </template>

    <template #default>
      <UiTabs v-model="currentTab" @update:modelValue="emit('update:currentTab', $event)">
        <UiTab text="Actions" icon="mdi:state-machine" value="actions">
          <VmStatement
            v-model="innerBlock.setup"
            :default="{ chain: [] }"
            @update:modelValue="emit('update:block', innerBlock)"
          />
        </UiTab>

        <UiTab text="Style" icon="mdi:palette-advanced" value="style">
          <BlockCssEditor
            v-model="innerBlock"
            @update:modelValue="emit('update:block', innerBlock)"
            style="margin: 0 var(--ui-breathe)"
          />
        </UiTab>

        <UiTab text="Source" icon="mdi:code-json" value="source">
          <VmStatement
            v-model="innerBlock"
            style="height:100%"
            @update:modelValue="emit('update:block', innerBlock)"
          />
        </UiTab>
      </UiTabs>
    </template>

    <template #footer="{ close }">
      <button type="button" class="ui-button --main" @click="accept() && close()">Aceptar</button>
      <button type="button" class="ui-button --cancel" @click="cancel() && close()">Cancelar</button>
    </template>
  </UiWindow>
</template>

<style lang="scss">
.LayoutPageWindow {
  .UiTabs {
    height: 100%;
  }
}

.StoryTree {
  max-width: 600px;

  .UiTree__children {
    margin-left: 12px;
  }
}
</style>