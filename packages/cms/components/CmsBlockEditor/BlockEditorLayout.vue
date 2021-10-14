<script setup>
import { ref, shallowRef, watch } from 'vue'
import { UiIcon, UiItem, UiWindow, UiPopover, UiTabs, UiTab } from '../../../ui/components'
import EditorAction from './EditorAction.vue'
import { getBlockEditors } from '../../composables'

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

const isFocused = ref(false)
const isWindowOpen = ref(false)
const currentActionIndex = ref(null)
const availableActions = shallowRef([])

getBlockEditors(props.block).then((r) => availableActions.value = r?.actions || [])

function openAction(targetActionIndex = null) {
  currentActionIndex.value = targetActionIndex
  isWindowOpen.value = true
  return true
}


function deleteBlock() {
  // if (!confirm('Eliminar este bloque?')) {
  //   return true
  // }
  emit('delete')
  return true
}
</script>

<template>
  <div
    class="BlockEditorLayout"
    :class="{
      'BlockEditorLayout--focused': isFocused,
      'BlockEditorLayout--open': isWindowOpen,
    }"
  >
    <div class="BlockEditorLayout__toolbar ui-toolbar">
      <UiIcon
        src="mdi:cursor-move"
        class="BlockEditorLayout__handle ui-clickable"
      />
      <slot name="toolbar" />

      <!-- dropdown options -->
      <UiPopover>
        <template #trigger>
          <UiIcon
            class="ui-clickable"
            src="mdi:dots-vertical"
          />
        </template>
        <template #contents="{close}">
          <UiItem
            v-for="(action,i) in availableActions"
            :key="i"
            :text="action.title"
            :icon="action.icon"
            class="ui-clickable"
            @click="openAction(i) && close()"
          />

          <UiItem
            text="Delete"
            icon="mdi:close"
            class="ui-clickable"
            @click="deleteBlock() && close()"
          />
        </template>
      </UiPopover>
    </div>

    <div class="BlockEditorLayout__face">
      <slot :block-value="blockValue" />
    </div>

    <UiWindow
      v-if="isWindowOpen"
      v-model:open="isWindowOpen"
    >
      <template #contents>
        <UiTabs v-model="currentActionIndex">
          <UiTab
            v-for="(action, i) in availableActions"
            :key="i"
            :value="i"
            :text="action.title"
            :icon="action.icon || 'mdi:star'"
          >
            <EditorAction
              v-model:block="blockValue"
              :action="action"
            />
          </UiTab>
        </UiTabs>
      </template>

      <template #footer="{hide}">
        <button
          type="button"
          class="ui-button --main"
          @click="accept() && hide()"
          v-text="'Aceptar'"
        />
        <button
          type="button"
          class="ui-button --cancel"
          @click="cancel() && hide()"
          v-text="'Cancelar'"
        />
      </template>
    </UiWindow>
  </div>
</template>

<style lang="scss">
.BlockEditorLayout {
  position: relative;
  border: 1px solid transparent;

  &__toolbar {
    position: absolute;
    bottom: 100%;

    transition: opacity var(--ui-duration-snap);
    opacity: 0;
    pointer-events: none;
  }

  &--open,
  &--focused,
  &:hover {
    border: 1px solid var(--ui-color-primary);

    .BlockEditorLayout__toolbar {
      opacity: 1;
      pointer-events: initial;
    }
  }

  &__handle {
    cursor: move !important;
  }
}
</style>