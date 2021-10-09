<script setup>
import { ref } from 'vue'
import { UiIcon, UiItem, UiWindow, UiPopover } from '../../../ui/components'
import BlockEditorActions from './BlockEditorActions.vue'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:block'])

const isFocused = ref(false)
const isWindowOpen = ref(false)
const currentAction = ref(null)

function openWindow(targetAction = null) {
  currentAction.value = targetAction
  isWindowOpen.value = true
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
            icon="mdi:cog"
            text="Source"
            class="ui-clickable"
            @click="openWindow(); close();"
          />
        </template>
      </UiPopover>
    </div>

    <div class="BlockEditorLayout__face">
      <slot />
    </div>

    <UiWindow
      v-if="isWindowOpen"
      v-model:open="isWindowOpen"
    >
      <template #contents>
        <BlockEditorActions
          :block="props.block"
          @update:block="emit('update:block', $event)"
        />
      </template>

      <template #footer="{hide}">
        <button
          type="button"
          class="ui-button --main"
          @click="hide"
          v-text="'Aceptar'"
        />
        <button
          type="button"
          class="ui-button --cancel"
          @click="hide"
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