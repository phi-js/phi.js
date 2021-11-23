<script setup>
import { ref, shallowRef, watch, inject } from 'vue'
import { UiIcon, UiItem, UiWindow, UiPopover, UiTabs, UiTab } from '../../../ui/components'
import EditorAction from './EditorAction.vue'
import { getBlockEditors } from '../../functions'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:block', 'delete'])

const blockValue = ref(null)
watch(
  () => props.block,
  (newValue) => blockValue.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true, deep: true },
)

function accept() {
  emit('update:block', JSON.parse(JSON.stringify(blockValue.value)))
  return true
}

function cancel() {
  blockValue.value = JSON.parse(JSON.stringify(props.block))
  return true
}

const isWindowOpen = ref(false)
const currentActionIndex = ref(null)
const availableActions = shallowRef([])

getBlockEditors(props.block, inject('$_cms_settings')).then((r) => availableActions.value = r?.actions || [])

function openAction(targetActionIndex = null) {
  currentActionIndex.value = targetActionIndex
  isWindowOpen.value = true
  return true
}

function deleteBlock() {
  emit('delete')
  return true
}

</script>

<template>
  <div class="BlockEditorWindow">
    <UiPopover
      class="BlockPopover"
      placement="bottom"
    >
      <template #trigger>
        <UiIcon
          class="LayoutRowEditor__sidebar-icon"
          src="mdi:dots-vertical"
        />
      </template>
      <template #contents="{close}">
        <UiItem
          v-for="(action,i) in availableActions"
          :key="i"
          :text="action.title"
          :icon="action.icon"
          class="BlockPopover__item BlockPopover__item--action"
          @click="openAction(i) && close()"
        />

        <UiItem
          text="Delete"
          icon="mdi:close"
          class="BlockPopover__item BlockPopover__item--delete"
          @click="deleteBlock() && close()"
        />
      </template>
    </UiPopover>

    <UiWindow
      v-if="isWindowOpen"
      v-model:open="isWindowOpen"
      name="block-settings"
      class="ui-theme-dark"
    >
      <UiTabs
        v-model="currentActionIndex"
        class="Action__picker--tabs"
      >
        <UiTab
          v-for="(action, i) in availableActions"
          :key="i"
          :value="i"
          :text="action.title"
          :icon="action.icon || 'mdi:star'"
        />
      </UiTabs>
      <div
        :key="currentActionIndex"
        class="Tab__contents"
      >
        <EditorAction
          v-model:block="blockValue"
          :action="availableActions[currentActionIndex]"
        />
      </div>

      <template #footer="{close}">
        <button
          type="button"
          class="ui__button ui__button--main"
          @click="accept() && close()"
          v-text="'Aceptar'"
        />
        <button
          type="button"
          class="ui__button ui__button--cancel"
          @click="cancel() && close()"
          v-text="'Cancelar'"
        />
      </template>
    </UiWindow>
  </div>
</template>

<style lang="scss">
.Tab {
  &__contents {
    padding: var(--ui-padding);
  }
}

.BlockPopover {
  .tippy-content {
    padding: 0;
  }

  &__item {
    padding: 4px 24px 4px var(--ui-padding-horizontal);
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>