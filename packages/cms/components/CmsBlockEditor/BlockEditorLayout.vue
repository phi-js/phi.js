<script setup>
import { ref } from 'vue'
import { UiIcon, UiWindow } from '../../../ui/components'

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
      <button
        class="ui-clickable"
        @click="openWindow()"
      >
        openWindow()
      </button>
    </div>

    <div class="BlockEditorLayout__face">
      <slot>
        Contenido default ?
      </slot>
    </div>

    <UiWindow v-model:open="isWindowOpen">
      Contenido de la ventana
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